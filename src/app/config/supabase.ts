// Configuração do Supabase
export const SUPABASE_PROJECT_ID = "xrazwoifawzqstdamwbd";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyYXp3b2lmYXd6cXN0ZGFtd2JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MTAzNDAsImV4cCI6MjA5MTk4NjM0MH0.yBDYNMAul9kKFwsUf0eITYQ0kCMzlPfFLJ6psZcFteU";
export const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const API_BASE = `${SUPABASE_URL}/functions/v1/make-server-33b1e26f`;

/**
 * Cabeçalhos para as rotas de escrita do painel admin.
 * A chave pública é exigida pelo gateway do Supabase; o `x-admin-token` é o
 * token da sessão do admin, usado pelo servidor para autorizar a gravação.
 */
export function adminHeaders(extra: Record<string, string> = {}): Record<string, string> {
  let token = '';
  try {
    token = localStorage.getItem('admin_token') || '';
  } catch {
    // localStorage indisponível (modo privado/SSR)
  }
  return {
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'x-admin-token': token,
    ...extra
  };
}

/**
 * fetch para as rotas do painel admin.
 *
 * Envia o `x-admin-token`. Se o servidor ainda não estiver atualizado, o
 * navegador bloqueia a requisição no preflight de CORS (o cabeçalho novo não é
 * permitido lá) e o fetch lança erro de rede — nesse caso repetimos sem o
 * cabeçalho, mantendo o painel funcionando exatamente como antes.
 * Assim o site e o servidor podem ser publicados em qualquer ordem.
 */
export async function adminFetch(
  url: string,
  options: RequestInit & { headers?: Record<string, string> } = {}
): Promise<Response> {
  const extra = options.headers || {};
  try {
    return await fetch(url, { ...options, headers: adminHeaders(extra) });
  } catch (error) {
    const semToken: Record<string, string> = {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      ...extra
    };
    return await fetch(url, { ...options, headers: semToken });
  }
}
