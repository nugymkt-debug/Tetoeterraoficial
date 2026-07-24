import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "x-admin-token"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ============ SESSÃO / AUTORIZAÇÃO DO ADMIN ============
// Duração da sessão do painel (7 dias)
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

async function sha256(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function createSession(username: string): Promise<string> {
  const token = crypto.randomUUID() + "-" + crypto.randomUUID();
  await kv.set(
    `admin_session:${token}`,
    JSON.stringify({ username, expiresAt: Date.now() + SESSION_TTL_MS })
  );
  return token;
}

async function isValidSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const raw = await kv.get(`admin_session:${token}`);
  if (!raw) return false;
  try {
    const session = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!session.expiresAt || session.expiresAt < Date.now()) {
      await kv.del(`admin_session:${token}`);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

const P = "/make-server-33b1e26f";

// Rotas de gravação: só o admin logado pode chamar.
// A leitura (GET) do site continua pública.
const PROTECTED_POSTS = new Set([
  `${P}/projects`,
  `${P}/rentals`,
  `${P}/sales`,
  `${P}/site-texts`,
  `${P}/logo`,
  `${P}/settings`,
  `${P}/init-data`,
  `${P}/fix-images`,
  `${P}/restore-all-images`,
  `${P}/storage/init`,
  `${P}/storage/upload`,
]);

/**
 * Exige uma sessão de admin válida (cabeçalho `x-admin-token`) nas rotas que
 * gravam dados — sem isso, qualquer pessoa com a chave pública do site
 * poderia sobrescrever ou apagar todo o conteúdo.
 */
app.use("*", async (c, next) => {
  const method = c.req.method;
  const path = new URL(c.req.url).pathname;

  const needsAuth =
    (method === "POST" && PROTECTED_POSTS.has(path)) ||
    (method === "DELETE" && path.startsWith(`${P}/storage/delete/`));

  if (!needsAuth) return next();

  if (!(await isValidSession(c.req.header("x-admin-token")))) {
    console.log(`🚫 Gravação bloqueada sem sessão válida: ${method} ${path}`);
    return c.json(
      { success: false, message: "Não autorizado. Faça login no painel novamente." },
      401
    );
  }

  return next();
});

// Health check endpoint
app.get("/make-server-33b1e26f/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Valida a sessão salva no navegador do admin
app.post("/make-server-33b1e26f/admin/verify", async (c) => {
  const token = c.req.header("x-admin-token");
  if (await isValidSession(token)) {
    return c.json({ success: true });
  }
  return c.json({ success: false, message: "Sessão inválida ou expirada" }, 401);
});

// Encerra a sessão atual
app.post("/make-server-33b1e26f/admin/logout", async (c) => {
  const token = c.req.header("x-admin-token");
  if (token) await kv.del(`admin_session:${token}`);
  return c.json({ success: true });
});

// Status completo do sistema
app.get("/make-server-33b1e26f/status", async (c) => {
  try {
    const projects = await kv.get("projects");
    const rentals = await kv.get("rental_properties");
    const sales = await kv.get("sale_properties");
    const texts = await kv.get("site_texts");
    const logo = await kv.get("site_logo");
    const admin = await kv.get("admin_credentials");

    const projectsData = projects ? JSON.parse(projects) : [];
    const rentalsData = rentals ? JSON.parse(rentals) : [];
    const salesData = sales ? JSON.parse(sales) : [];

    return c.json({
      success: true,
      status: "Sistema operacional",
      timestamp: new Date().toISOString(),
      data: {
        projects: {
          total: projectsData.length,
          premium: projectsData.filter((p: any) => p.premium).length,
          withImages: projectsData.filter((p: any) => p.image).length
        },
        rentals: {
          total: rentalsData.length,
          totalImages: rentalsData.reduce((sum: number, r: any) => sum + (r.images?.length || 0), 0)
        },
        sales: {
          total: salesData.length,
          totalImages: salesData.reduce((sum: number, s: any) => sum + (s.images?.length || 0), 0)
        },
        siteTexts: !!texts,
        logo: !!logo,
        adminConfigured: !!admin
      }
    });
  } catch (error) {
    console.log("Erro ao buscar status:", error);
    return c.json({ success: false, message: "Erro ao buscar status" }, 500);
  }
});

// ============ AUTENTICAÇÃO ============
app.post("/make-server-33b1e26f/admin/login", async (c) => {
  try {
    const { username, password } = await c.req.json();

    // Buscar credenciais admin
    const adminCreds = await kv.get("admin_credentials");

    if (!adminCreds) {
      return c.json({
        success: false,
        message: "Sistema não configurado. Configure as credenciais primeiro usando /admin/setup"
      }, 401);
    }

    const creds = JSON.parse(adminCreds);

    // Aceita tanto o formato antigo (senha em texto puro) quanto o novo (hash).
    // No primeiro login com a senha correta, migra automaticamente para hash.
    let senhaOk = false;
    if (creds.passwordHash) {
      senhaOk = (await sha256(password)) === creds.passwordHash;
    } else if (typeof creds.password === "string") {
      senhaOk = password === creds.password;
      if (senhaOk) {
        creds.passwordHash = await sha256(password);
        delete creds.password;
        await kv.set("admin_credentials", JSON.stringify(creds));
        console.log("🔐 Senha do admin migrada para hash");
      }
    }

    if (username === creds.username && senhaOk) {
      const token = await createSession(creds.username);
      return c.json({
        success: true,
        token,
        requirePasswordChange: creds.requirePasswordChange || false
      });
    }

    return c.json({ success: false, message: "Credenciais inválidas" }, 401);
  } catch (error) {
    console.log("Erro no login:", error);
    return c.json({ success: false, message: "Erro no servidor" }, 500);
  }
});

// Configuração inicial - usar APENAS UMA VEZ para definir credenciais
app.post("/make-server-33b1e26f/admin/setup", async (c) => {
  try {
    const { username, password, secretKey } = await c.req.json();

    // Verificar se já existe configuração
    const existingCreds = await kv.get("admin_credentials");
    if (existingCreds) {
      return c.json({
        success: false,
        message: "Sistema já configurado. Use a função de alterar senha se necessário."
      }, 400);
    }

    // Chave secreta para setup (apenas você conhece)
    if (secretKey !== "TETO-TERRA-SETUP-2026") {
      return c.json({ success: false, message: "Chave secreta inválida" }, 401);
    }

    if (!password || String(password).length < 8) {
      return c.json({ success: false, message: "A senha deve ter no mínimo 8 caracteres" }, 400);
    }

    // Criar credenciais (senha guardada só como hash)
    const newCreds = {
      username: username || "admin",
      passwordHash: await sha256(password),
      requirePasswordChange: false
    };
    await kv.set("admin_credentials", JSON.stringify(newCreds));

    return c.json({ success: true, message: "Credenciais configuradas com sucesso" });
  } catch (error) {
    console.log("Erro no setup:", error);
    return c.json({ success: false, message: "Erro no servidor" }, 500);
  }
});

// Alterar senha admin
app.post("/make-server-33b1e26f/admin/change-password", async (c) => {
  try {
    const { currentPassword, newPassword } = await c.req.json();

    const adminCreds = await kv.get("admin_credentials");
    if (!adminCreds) {
      return c.json({ success: false, message: "Credenciais não encontradas" }, 404);
    }

    const creds = JSON.parse(adminCreds);

    const atualOk = creds.passwordHash
      ? (await sha256(currentPassword)) === creds.passwordHash
      : creds.password === currentPassword;

    if (!atualOk) {
      return c.json({ success: false, message: "Senha atual incorreta" }, 401);
    }

    if (!newPassword || String(newPassword).length < 8) {
      return c.json({ success: false, message: "A nova senha deve ter no mínimo 8 caracteres" }, 400);
    }

    creds.passwordHash = await sha256(newPassword);
    delete creds.password;
    await kv.set("admin_credentials", JSON.stringify(creds));

    return c.json({ success: true, message: "Senha alterada com sucesso" });
  } catch (error) {
    console.log("Erro ao alterar senha:", error);
    return c.json({ success: false, message: "Erro no servidor" }, 500);
  }
});

// ============ CONFIGURAÇÕES GERAIS ============
app.get("/make-server-33b1e26f/settings", async (c) => {
  try {
    const settings = await kv.get("site_settings");
    return c.json({ success: true, data: settings ? JSON.parse(settings) : null });
  } catch (error) {
    console.log("Erro ao buscar configurações:", error);
    return c.json({ success: false, message: "Erro no servidor" }, 500);
  }
});

app.post("/make-server-33b1e26f/settings", async (c) => {
  try {
    const data = await c.req.json();
    await kv.set("site_settings", JSON.stringify(data));
    return c.json({ success: true, message: "Configurações salvas" });
  } catch (error) {
    console.log("Erro ao salvar configurações:", error);
    return c.json({ success: false, message: "Erro no servidor" }, 500);
  }
});

// ============ INICIALIZAR DADOS PADRÃO ============
app.post("/make-server-33b1e26f/init-data", async (c) => {
  try {
    const { projects, rentals, sales } = await c.req.json();

    // Salvar dados apenas se não existirem
    const existingProjects = await kv.get("projects");
    if (!existingProjects) {
      await kv.set("projects", JSON.stringify(projects));
    }

    const existingRentals = await kv.get("rental_properties");
    if (!existingRentals) {
      await kv.set("rental_properties", JSON.stringify(rentals));
    }

    const existingSales = await kv.get("sale_properties");
    if (!existingSales) {
      await kv.set("sale_properties", JSON.stringify(sales));
    }

    return c.json({ success: true, message: "Dados inicializados" });
  } catch (error) {
    console.log("Erro ao inicializar dados:", error);
    return c.json({ success: false, message: "Erro no servidor" }, 500);
  }
});

// ============ EMPREENDIMENTOS ============
app.get("/make-server-33b1e26f/projects", async (c) => {
  try {
    console.log('📥 GET /projects - Buscando projetos do KV store...');
    const projects = await kv.get("projects");
    const parsedData = projects ? JSON.parse(projects) : [];
    console.log(`✅ Retornando ${parsedData.length} projetos`);
    return c.json({ success: true, data: parsedData });
  } catch (error) {
    console.log("❌ Erro ao buscar projetos:", error);
    return c.json({ success: false, message: "Erro no servidor" }, 500);
  }
});

app.post("/make-server-33b1e26f/projects", async (c) => {
  try {
    const data = await c.req.json();
    console.log(`💾 POST /projects - Salvando ${data.length} projetos no KV store...`);
    await kv.set("projects", JSON.stringify(data));
    console.log(`✅ ${data.length} projetos salvos com sucesso`);
    return c.json({ success: true, message: "Projetos salvos", count: data.length });
  } catch (error) {
    console.log("❌ Erro ao salvar projetos:", error);
    return c.json({ success: false, message: "Erro no servidor" }, 500);
  }
});

// ============ IMÓVEIS PARA ALUGAR ============
app.get("/make-server-33b1e26f/rentals", async (c) => {
  try {
    console.log('📥 GET /rentals - Buscando imóveis para alugar do KV store...');
    const rentals = await kv.get("rental_properties");
    const parsedData = rentals ? JSON.parse(rentals) : [];
    console.log(`✅ Retornando ${parsedData.length} imóveis para alugar`);
    return c.json({ success: true, data: parsedData });
  } catch (error) {
    console.log("❌ Erro ao buscar imóveis para alugar:", error);
    return c.json({ success: false, message: "Erro no servidor" }, 500);
  }
});

app.post("/make-server-33b1e26f/rentals", async (c) => {
  try {
    const data = await c.req.json();
    console.log(`💾 POST /rentals - Salvando ${data.length} imóveis para alugar no KV store...`);
    console.log(`📸 Total de imagens: ${data.reduce((sum: number, item: any) => sum + (item.images?.length || 0), 0)}`);
    await kv.set("rental_properties", JSON.stringify(data));
    console.log(`✅ ${data.length} imóveis para alugar salvos com sucesso`);
    return c.json({ success: true, message: "Imóveis para alugar salvos", count: data.length });
  } catch (error) {
    console.log("❌ Erro ao salvar imóveis para alugar:", error);
    return c.json({ success: false, message: "Erro no servidor" }, 500);
  }
});

// ============ IMÓVEIS PARA VENDA ============
app.get("/make-server-33b1e26f/sales", async (c) => {
  try {
    console.log('📥 GET /sales - Buscando imóveis para venda do KV store...');
    const sales = await kv.get("sale_properties");
    const parsedData = sales ? JSON.parse(sales) : [];
    console.log(`✅ Retornando ${parsedData.length} imóveis para venda`);
    return c.json({ success: true, data: parsedData });
  } catch (error) {
    console.log("❌ Erro ao buscar imóveis para venda:", error);
    return c.json({ success: false, message: "Erro no servidor" }, 500);
  }
});

app.post("/make-server-33b1e26f/sales", async (c) => {
  try {
    const data = await c.req.json();
    console.log(`💾 POST /sales - Salvando ${data.length} imóveis para venda no KV store...`);
    console.log(`📸 Total de imagens: ${data.reduce((sum: number, item: any) => sum + (item.images?.length || 0), 0)}`);
    await kv.set("sale_properties", JSON.stringify(data));
    console.log(`✅ ${data.length} imóveis para venda salvos com sucesso`);
    return c.json({ success: true, message: "Imóveis para venda salvos", count: data.length });
  } catch (error) {
    console.log("❌ Erro ao salvar imóveis para venda:", error);
    return c.json({ success: false, message: "Erro no servidor" }, 500);
  }
});

// ============ STORAGE - UPLOAD DE IMAGENS ============
// Inicializar bucket (criar se não existir)
app.post("/make-server-33b1e26f/storage/init", async (c) => {
  try {
    const bucketName = "make-33b1e26f-images";

    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);

    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 10485760 // 10MB
      });
      console.log(`Bucket ${bucketName} criado com sucesso`);
    }

    return c.json({ success: true, message: "Storage inicializado" });
  } catch (error) {
    console.log("Erro ao inicializar storage:", error);
    return c.json({ success: false, message: "Erro no servidor" }, 500);
  }
});

// Upload de imagem
app.post("/make-server-33b1e26f/storage/upload", async (c) => {
  try {
    const bucketName = "make-33b1e26f-images";
    const formData = await c.req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return c.json({ success: false, message: "Nenhum arquivo enviado" }, 400);
    }

    // Gerar nome único
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomStr}.${fileExt}`;

    // Converter File para ArrayBuffer e depois para Uint8Array
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload para Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, uint8Array, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.log("Erro no upload:", error);
      return c.json({ success: false, message: error.message }, 500);
    }

    // Obter URL pública
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return c.json({
      success: true,
      url: publicUrl,
      fileName: fileName
    });
  } catch (error) {
    console.log("Erro ao fazer upload:", error);
    return c.json({ success: false, message: "Erro no servidor" }, 500);
  }
});

// Deletar imagem
app.delete("/make-server-33b1e26f/storage/delete/:fileName", async (c) => {
  try {
    const bucketName = "make-33b1e26f-images";
    const fileName = c.req.param('fileName');

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([fileName]);

    if (error) {
      console.log("Erro ao deletar:", error);
      return c.json({ success: false, message: error.message }, 500);
    }

    return c.json({ success: true, message: "Imagem deletada" });
  } catch (error) {
    console.log("Erro ao deletar imagem:", error);
    return c.json({ success: false, message: "Erro no servidor" }, 500);
  }
});

// ============ TEXTOS DO SITE ============
app.get("/make-server-33b1e26f/site-texts", async (c) => {
  try {
    const texts = await kv.get("site_texts");
    return c.json({ success: true, data: texts ? JSON.parse(texts) : null });
  } catch (error) {
    console.log("Erro ao buscar textos do site:", error);
    return c.json({ success: false, message: "Erro no servidor" }, 500);
  }
});

app.post("/make-server-33b1e26f/site-texts", async (c) => {
  try {
    const data = await c.req.json();
    await kv.set("site_texts", JSON.stringify(data));
    return c.json({ success: true, message: "Textos salvos" });
  } catch (error) {
    console.log("Erro ao salvar textos:", error);
    return c.json({ success: false, message: "Erro no servidor" }, 500);
  }
});

// ============ LOGO ============
app.post("/make-server-33b1e26f/logo", async (c) => {
  try {
    const { url } = await c.req.json();
    await kv.set("site_logo", url);
    return c.json({ success: true, message: "Logo salvo" });
  } catch (error) {
    console.log("Erro ao salvar logo:", error);
    return c.json({ success: false, message: "Erro no servidor" }, 500);
  }
});

app.get("/make-server-33b1e26f/logo", async (c) => {
  try {
    const logo = await kv.get("site_logo");
    return c.json({ success: true, url: logo });
  } catch (error) {
    console.log("Erro ao buscar logo:", error);
    return c.json({ success: false, message: "Erro no servidor" }, 500);
  }
});

// ============ DEBUG - VER DADOS ============
app.get("/make-server-33b1e26f/debug/data", async (c) => {
  try {
    const projects = await kv.get("projects");
    const rentals = await kv.get("rental_properties");
    const sales = await kv.get("sale_properties");

    return c.json({
      success: true,
      data: {
        projects: projects ? JSON.parse(projects) : null,
        rentals: rentals ? JSON.parse(rentals) : null,
        sales: sales ? JSON.parse(sales) : null
      }
    });
  } catch (error) {
    console.log("Erro ao buscar dados de debug:", error);
    return c.json({ success: false, message: "Erro no servidor" }, 500);
  }
});

// ============ RESTAURAR IMAGENS DOS PROJETOS ============
app.post("/make-server-33b1e26f/fix-images", async (c) => {
  try {
    const projectsStr = await kv.get("projects");
    if (!projectsStr) {
      return c.json({ success: false, message: "Nenhum projeto encontrado" }, 404);
    }

    const projects = JSON.parse(projectsStr);
    const defaultImages: Record<string, string> = {
      'Alto Mangalarga': 'https://images.unsplash.com/photo-1758448756880-01dbaf85597d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBob21lJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3MjE4NDczOHww&ixlib=rb-4.1.0&q=80&w=1080',
      'Oni Araras': 'https://images.unsplash.com/photo-1640109478916-f445f8f19b11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob21lJTIwYmVkcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc3MjE2NTc0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      'Araltes Sebollas': 'https://images.unsplash.com/photo-1758448756207-54505680d130?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwaG9tZSUyMGV4dGVyaW9yJTIwbmF0dXJlfGVufDF8fHx8MTc3MjE4NDczOXww&ixlib=rb-4.1.0&q=80&w=1080',
      'Borgo Del Vino Grande': 'https://images.unsplash.com/photo-1770459202884-6b6effed0b84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGx1eHVyeSUyMHByb3BlcnR5JTIwdmlld3xlbnwxfHx8fDE3NzIxODQ3Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'Farm Ville': 'https://images.unsplash.com/photo-1629267274195-ed114a940c51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXJyYSUyMG1vdW50YWlucyUyMG5hdHVyZSUyMGxhbmRzY2FwZSUyMGJyYXppbHxlbnwxfHx8fDE3NzIxODQ3Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'Fazenda Bela Vista': 'https://images.unsplash.com/photo-1758448756880-01dbaf85597d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBob21lJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3MjE4NDczOHww&ixlib=rb-4.1.0&q=80&w=1080',
      'Fazenda Ouro Verde': 'https://images.unsplash.com/photo-1758448756207-54505680d130?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwaG9tZSUyMGV4dGVyaW9yJTIwbmF0dXJlfGVufDF8fHx8MTc3MjE4NDczOXww&ixlib=rb-4.1.0&q=80&w=1080',
      'Kabana Nogueira': 'https://images.unsplash.com/photo-1710750473266-61b0b8cce0e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwaG91c2UlMjBpbnRlcmlvciUyMGVsZWdhbnR8ZW58MXx8fHwxNzcyMTg0NzM4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'Myo Araras': 'https://images.unsplash.com/photo-1640109478916-f445f8f19b11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob21lJTIwYmVkcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc3MjE2NTc0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      'Quinta Portuguesa': 'https://images.unsplash.com/photo-1770459202884-6b6effed0b84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGx1eHVyeSUyMHByb3BlcnR5JTIwdmlld3xlbnwxfHx8fDE3NzIxODQ3Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'Reserva Concórdia': 'https://images.unsplash.com/photo-1629267274195-ed114a940c51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXJyYSUyMG1vdW50YWlucyUyMG5hdHVyZSUyMGxhbmRzY2FwZSUyMGJyYXppbHxlbnwxfHx8fDE3NzIxODQ3Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'Reserva do Barão': 'https://images.unsplash.com/photo-1758448756880-01dbaf85597d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBob21lJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3MjE4NDczOHww&ixlib=rb-4.1.0&q=80&w=1080',
      'Reserva Granja Brasil': 'https://images.unsplash.com/photo-1710750473266-61b0b8cce0e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwaG91c2UlMjBpbnRlcmlvciUyMGVsZWdhbnR8ZW58MXx8fHwxNzcyMTg0NzM4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'Santommaso': 'https://images.unsplash.com/photo-1758448756207-54505680d130?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwaG9tZSUyMGV4dGVyaW9yJTIwbmF0dXJlfGVufDF8fHx8MTc3MjE4NDczOXww&ixlib=rb-4.1.0&q=80&w=1080',
      'Summit Valparaíso': 'https://images.unsplash.com/photo-1640109478916-f445f8f19b11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob21lJTIwYmVkcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc3MjE2NTc0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      'Vila Dom Carlo': 'https://images.unsplash.com/photo-1770459202884-6b6effed0b84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGx1eHVyeSUyMHByb3BlcnR5JTIwdmlld3xlbnwxfHx8fDE3NzIxODQ3Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'Vinícula Maturano': 'https://images.unsplash.com/photo-1629267274195-ed114a940c51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXJyYSUyMG1vdW50YWlucyUyMG5hdHVyZSUyMGxhbmRzY2FwZSUyMGJyYXppbHxlbnwxfHx8fDE3NzIxODQ3Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080'
    };

    let restored = 0;
    const fixedProjects = projects.map((project: any) => {
      if (!project.image && defaultImages[project.name]) {
        restored++;
        return { ...project, image: defaultImages[project.name] };
      }
      return project;
    });

    await kv.set("projects", JSON.stringify(fixedProjects));

    return c.json({
      success: true,
      message: `${restored} imagens restauradas automaticamente`,
      restored,
      total: projects.length
    });
  } catch (error) {
    console.log("Erro ao restaurar imagens:", error);
    return c.json({ success: false, message: "Erro no servidor" }, 500);
  }
});

// ============ RESTAURAR TODAS AS IMAGENS PADRÃO ============
app.post("/make-server-33b1e26f/restore-all-images", async (c) => {
  try {
    console.log('🔧 INICIANDO RESTAURAÇÃO TOTAL DE IMAGENS...');

    // Restaurar imagens dos projetos
    const projectsStr = await kv.get("projects");
    const projects = projectsStr ? JSON.parse(projectsStr) : [];

    const defaultProjectImages: Record<string, string> = {
      'Alto Mangalarga': 'https://images.unsplash.com/photo-1758448756880-01dbaf85597d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBob21lJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3MjE4NDczOHww&ixlib=rb-4.1.0&q=80&w=1080',
      'Oni Araras': 'https://images.unsplash.com/photo-1640109478916-f445f8f19b11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob21lJTIwYmVkcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc3MjE2NTc0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      'Araltes Sebollas': 'https://images.unsplash.com/photo-1758448756207-54505680d130?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwaG9tZSUyMGV4dGVyaW9yJTIwbmF0dXJlfGVufDF8fHx8MTc3MjE4NDczOXww&ixlib=rb-4.1.0&q=80&w=1080',
      'Borgo Del Vino Grande': 'https://images.unsplash.com/photo-1770459202884-6b6effed0b84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGx1eHVyeSUyMHByb3BlcnR5JTIwdmlld3xlbnwxfHx8fDE3NzIxODQ3Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'Farm Ville': 'https://images.unsplash.com/photo-1629267274195-ed114a940c51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXJyYSUyMG1vdW50YWlucyUyMG5hdHVyZSUyMGxhbmRzY2FwZSUyMGJyYXppbHxlbnwxfHx8fDE3NzIxODQ3Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'Fazenda Bela Vista': 'https://images.unsplash.com/photo-1758448756880-01dbaf85597d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBob21lJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3MjE4NDczOHww&ixlib=rb-4.1.0&q=80&w=1080',
      'Fazenda Ouro Verde': 'https://images.unsplash.com/photo-1758448756207-54505680d130?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwaG9tZSUyMGV4dGVyaW9yJTIwbmF0dXJlfGVufDF8fHx8MTc3MjE4NDczOXww&ixlib=rb-4.1.0&q=80&w=1080',
      'Kabana Nogueira': 'https://images.unsplash.com/photo-1710750473266-61b0b8cce0e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwaG91c2UlMjBpbnRlcmlvciUyMGVsZWdhbnR8ZW58MXx8fHwxNzcyMTg0NzM4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'Myo Araras': 'https://images.unsplash.com/photo-1640109478916-f445f8f19b11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob21lJTIwYmVkcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc3MjE2NTc0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      'Quinta Portuguesa': 'https://images.unsplash.com/photo-1770459202884-6b6effed0b84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGx1eHVyeSUyMHByb3BlcnR5JTIwdmlld3xlbnwxfHx8fDE3NzIxODQ3Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'Reserva Concórdia': 'https://images.unsplash.com/photo-1629267274195-ed114a940c51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXJyYSUyMG1vdW50YWlucyUyMG5hdHVyZSUyMGxhbmRzY2FwZSUyMGJyYXppbHxlbnwxfHx8fDE3NzIxODQ3Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'Reserva do Barão': 'https://images.unsplash.com/photo-1758448756880-01dbaf85597d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBob21lJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3MjE4NDczOHww&ixlib=rb-4.1.0&q=80&w=1080',
      'Reserva Granja Brasil': 'https://images.unsplash.com/photo-1710750473266-61b0b8cce0e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwaG91c2UlMjBpbnRlcmlvciUyMGVsZWdhbnR8ZW58MXx8fHwxNzcyMTg0NzM4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'Santommaso': 'https://images.unsplash.com/photo-1758448756207-54505680d130?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwaG9tZSUyMGV4dGVyaW9yJTIwbmF0dXJlfGVufDF8fHx8MTc3MjE4NDczOXww&ixlib=rb-4.1.0&q=80&w=1080',
      'Summit Valparaíso': 'https://images.unsplash.com/photo-1640109478916-f445f8f19b11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob21lJTIwYmVkcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc3MjE2NTc0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      'Vila Dom Carlo': 'https://images.unsplash.com/photo-1770459202884-6b6effed0b84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGx1eHVyeSUyMHByb3BlcnR5JTIwdmlld3xlbnwxfHx8fDE3NzIxODQ3Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'Vinícula Maturano': 'https://images.unsplash.com/photo-1629267274195-ed114a940c51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXJyYSUyMG1vdW50YWlucyUyMG5hdHVyZSUyMGxhbmRzY2FwZSUyMGJyYXppbHxlbnwxfHx8fDE3NzIxODQ3Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080'
    };

    // IMPORTANTE: a foto já cadastrada tem prioridade. Esta rota só PREENCHE
    // o que estiver vazio — nunca substitui uma imagem enviada pelo painel.
    const fixedProjects = projects.map((project: any) => ({
      ...project,
      image: project.image || defaultProjectImages[project.name] || 'https://images.unsplash.com/photo-1758448756880-01dbaf85597d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBob21lJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3MjE4NDczOHww&ixlib=rb-4.1.0&q=80&w=1080'
    }));

    await kv.set("projects", JSON.stringify(fixedProjects));
    console.log('✅ Imagens dos projetos restauradas');

    // Restaurar imagens dos aluguéis
    const rentalsStr = await kv.get("rental_properties");
    const rentals = rentalsStr ? JSON.parse(rentalsStr) : [];

    const defaultRentalImages = [
      'https://images.unsplash.com/photo-1758448756880-01dbaf85597d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBob21lJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3MjE4NDczOHww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1628746041543-f27904c01cd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3VzZSUyMGJlZHJvb20lMjBtb2Rlcm58ZW58MXx8fHwxNzczMzQwNzAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1755624222023-621f7718950b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwbHV4dXJ5JTIwaG9tZXxlbnwxfHx8fDE3NzMzMDgxNTN8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ];

    const fixedRentals = rentals.map((rental: any) => ({
      ...rental,
      images: (rental.images && rental.images.length > 0) ? rental.images : defaultRentalImages
    }));

    await kv.set("rental_properties", JSON.stringify(fixedRentals));
    console.log('✅ Imagens dos aluguéis restauradas');

    // Restaurar imagens das vendas
    const salesStr = await kv.get("sale_properties");
    const sales = salesStr ? JSON.parse(salesStr) : [];

    const defaultSaleImages = [
      'https://images.unsplash.com/photo-1561409037-c7be81613c1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXRyb3BvbGlzJTIwYnJhemlsJTIwbW91bnRhaW5zJTIwbHV4dXJ5JTIwaG9tZXxlbnwxfHx8fDE3NzIxODQ3Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1770459202884-6b6effed0b84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGx1eHVyeSUyMHByb3BlcnR5JTIwdmlld3xlbnwxfHx8fDE3NzIxODQ3Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1758448756207-54505680d130?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwaG9tZSUyMGV4dGVyaW9yJTIwbmF0dXJlfGVufDF8fHx8MTc3MjE4NDczOXww&ixlib=rb-4.1.0&q=80&w=1080'
    ];

    const fixedSales = sales.map((sale: any) => ({
      ...sale,
      images: (sale.images && sale.images.length > 0) ? sale.images : defaultSaleImages
    }));

    await kv.set("sale_properties", JSON.stringify(fixedSales));
    console.log('✅ Imagens das vendas restauradas');

    return c.json({
      success: true,
      message: '✅ TODAS as imagens foram restauradas com sucesso!',
      details: {
        projects: fixedProjects.length,
        rentals: fixedRentals.length,
        sales: fixedSales.length
      }
    });
  } catch (error) {
    console.log("Erro ao restaurar todas as imagens:", error);
    return c.json({ success: false, message: "Erro no servidor" }, 500);
  }
});

Deno.serve(app.fetch);