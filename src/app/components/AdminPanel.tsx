import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Select } from './Select';
import { ImageUploader } from './ImageUploader';
import { MultiImageUploader } from './MultiImageUploader';
import { X, Save, Plus, Trash2, Edit, LogOut, Eye, EyeOff, Settings, FileText, Image as ImageIcon } from 'lucide-react';
import { SUPABASE_PROJECT_ID, SUPABASE_ANON_KEY, API_BASE as API_BASE_URL } from '../config/supabase';

const projectId = SUPABASE_PROJECT_ID;
const publicAnonKey = SUPABASE_ANON_KEY;
const API_BASE = API_BASE_URL;

interface AdminPanelProps {
  onClose: () => void;
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Função para validar se um projeto está íntegro
function validateProject(project: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!project.name) errors.push('Nome obrigatório');
  if (!project.location) errors.push('Localização obrigatória');
  if (!project.status) errors.push('Status obrigatório');
  if (!project.image) errors.push('Imagem obrigatória');

  return { valid: errors.length === 0, errors };
}

// Função para validar se um imóvel está íntegro
function validateProperty(property: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!property.title) errors.push('Título obrigatório');
  if (!property.location) errors.push('Localização obrigatória');
  if (!property.images || property.images.length === 0) errors.push('Pelo menos 1 imagem obrigatória');
  if (!property.price) errors.push('Preço obrigatório');

  return { valid: errors.length === 0, errors };
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');

  // Estados para dados
  const [projects, setProjects] = useState<any[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [siteTexts, setSiteTexts] = useState<any>({});
  const [logoUrl, setLogoUrl] = useState<string>('');

  // Backups automáticos antes de qualquer mudança
  const [projectsBackup, setProjectsBackup] = useState<any[]>([]);
  const [rentalsBackup, setRentalsBackup] = useState<any[]>([]);
  const [salesBackup, setSalesBackup] = useState<any[]>([]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_token', data.token);
        loadAllData();
      } else {
        setLoginError(data.message || 'Erro ao fazer login');
      }
    } catch (error) {
      const isFetchError = error instanceof TypeError && (error as TypeError).message === 'Failed to fetch';
      if (isFetchError) {
        setLoginError('Não foi possível conectar ao servidor. O painel admin funciona apenas após o deploy do projeto.');
      } else {
        console.error('Erro no login:', error);
        setLoginError('Erro ao conectar com o servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      setIsAuthenticated(false);
      localStorage.removeItem('admin_token');
      setUsername('');
      setPassword('');
    }
  };

  const handleRestoreAllImages = async () => {
    if (!confirm('🔧 RESTAURAR TODAS AS IMAGENS PADRÃO?\n\nEsta ação irá restaurar as imagens padrão de todos os empreendimentos, aluguéis e vendas.\n\nContinuar?')) {
      return;
    }

    setLoading(true);
    try {
      console.log('🔧 Iniciando restauração de imagens...');
      const response = await fetch(`${API_BASE}/restore-all-images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('📥 Resultado da restauração:', result);

      if (result.success) {
        alert('✅ ' + result.message + '\n\n' + JSON.stringify(result.details, null, 2) + '\n\nRecarregando dados...');
        loadAllData();
      } else {
        alert('❌ Erro ao restaurar imagens: ' + result.message);
      }
    } catch (error) {
      console.error('❌ Erro ao restaurar imagens:', error);
      alert('❌ Erro ao restaurar imagens: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const timestamp = new Date().getTime();
      console.log('📥 Carregando dados do admin...');

      const [projectsRes, rentalsRes, salesRes, textsRes, logoRes] = await Promise.all([
        fetch(`${API_BASE}/projects?_t=${timestamp}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          cache: 'no-store'
        }),
        fetch(`${API_BASE}/rentals?_t=${timestamp}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          cache: 'no-store'
        }),
        fetch(`${API_BASE}/sales?_t=${timestamp}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          cache: 'no-store'
        }),
        fetch(`${API_BASE}/site-texts?_t=${timestamp}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          cache: 'no-store'
        }),
        fetch(`${API_BASE}/logo?_t=${timestamp}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          cache: 'no-store'
        })
      ]);

      const [projectsData, rentalsData, salesData, textsData, logoData] = await Promise.all([
        projectsRes.json(),
        rentalsRes.json(),
        salesRes.json(),
        textsRes.json(),
        logoRes.json()
      ]);

      const loadedProjects = projectsData.success && projectsData.data ? projectsData.data : [];
      const loadedRentals = rentalsData.success && rentalsData.data ? rentalsData.data : [];
      const loadedSales = salesData.success && salesData.data ? salesData.data : [];

      setProjects(loadedProjects);
      setRentals(loadedRentals);
      setSales(loadedSales);
      setSiteTexts(textsData.success && textsData.data ? textsData.data : {});
      setLogoUrl(logoData.success && logoData.url ? logoData.url : '');

      const cloned = deepClone({ projects: loadedProjects, rentals: loadedRentals, sales: loadedSales });
      setProjectsBackup(cloned.projects);
      setRentalsBackup(cloned.rentals);
      setSalesBackup(cloned.sales);

      console.log('✅ Dados carregados com sucesso');
    } catch (error) {
      const isFetchError = error instanceof TypeError && error.message === 'Failed to fetch';
      if (isFetchError) {
        console.log('ℹ️ Não foi possível conectar ao servidor (esperado no preview)');
        // Inicializar com arrays vazios para permitir uso do painel em modo offline
        setProjects([]);
        setRentals([]);
        setSales([]);
      } else {
        console.error('Erro ao carregar dados:', error);
        alert('❌ Erro ao carregar dados do servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (type: string, data: any[]) => {
    // VALIDAÇÃO 1: Verificar se há dados
    if (!data || data.length === 0) {
      alert('⚠️ Nenhum dado para salvar!');
      return;
    }

    // VALIDAÇÃO 2: Verificar integridade dos dados
    let hasErrors = false;
    const errors: string[] = [];

    data.forEach((item, index) => {
      if (type === 'projects') {
        const validation = validateProject(item);
        if (!validation.valid) {
          hasErrors = true;
          errors.push(`Projeto ${index + 1} (${item.name || 'sem nome'}): ${validation.errors.join(', ')}`);
        }
      } else if (type === 'rentals' || type === 'sales') {
        const validation = validateProperty(item);
        if (!validation.valid) {
          hasErrors = true;
          errors.push(`Imóvel ${index + 1} (${item.title || 'sem título'}): ${validation.errors.join(', ')}`);
        }
      }
    });

    if (hasErrors) {
      const continuar = confirm(
        '⚠️ ATENÇÃO: Encontrados problemas nos dados:\n\n' +
        errors.slice(0, 5).join('\n') +
        (errors.length > 5 ? `\n...e mais ${errors.length - 5} erros` : '') +
        '\n\nDeseja salvar mesmo assim?'
      );

      if (!continuar) {
        return;
      }
    }

    setLoading(true);
    try {
      console.log(`💾 Salvando ${type}:`, data.length, 'itens');

      const response = await fetch(`${API_BASE}/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log(`📥 Resultado do servidor:`, result);

      if (result.success) {
        let successMessage = `✅ Dados salvos com sucesso!`;

        if (result.count) {
          successMessage += `\n📊 ${result.count} itens salvos`;
        }

        if (type === 'rentals' || type === 'sales') {
          const totalImages = data.reduce((sum: number, item: any) => sum + (item.images?.length || 0), 0);
          successMessage += `\n📸 ${totalImages} imagens no total`;
        }

        successMessage += '\n\n🔄 O site será atualizado automaticamente em segundos.';

        alert(successMessage);

        // Atualizar backups
        if (type === 'projects') setProjectsBackup(deepClone(data));
        if (type === 'rentals') setRentalsBackup(deepClone(data));
        if (type === 'sales') setSalesBackup(deepClone(data));

        // Notificar o site principal para recarregar dados imediatamente via BroadcastChannel
        try {
          const bc = new BroadcastChannel('teto-terra-admin');
          bc.postMessage({ type: 'DATA_UPDATED', dataType: type, timestamp: Date.now() });
          bc.close();
        } catch (_) {}

        loadAllData();
      } else {
        alert('❌ Erro ao salvar: ' + result.message);
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('❌ Erro ao salvar dados no servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
      loadAllData();
    }
  }, []);

  // Tela de login
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#162936]" style={{ fontFamily: 'Playfair Display, serif' }}>
              Painel Administrativo
            </h2>
            <button onClick={onClose} className="text-[#747c80] hover:text-[#162936]">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Usuário"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
            />
            <div className="relative">
              <Input
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-[#747c80] hover:text-[#162936]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>

            {loginError?.includes('não configurado') && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-900">
                <p className="font-bold mb-2">🔧 Sistema não configurado</p>
                <p className="mb-2">
                  O administrador precisa configurar as credenciais primeiro.
                </p>
                <button
                  onClick={() => window.location.href = '/admin/setup'}
                  className="text-yellow-700 underline hover:text-yellow-900 font-medium"
                >
                  Ir para configuração →
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }

  // Painel principal
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-6xl my-8 shadow-2xl">
        {/* Header */}
        <div className="bg-[#162936] text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
            Painel Administrativo
          </h2>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="!border-yellow-500 !text-yellow-500 hover:!bg-yellow-500 hover:!text-white"
              onClick={handleRestoreAllImages}
              disabled={loading}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Restaurar Imagens
            </Button>
            <Button variant="outline" className="!border-white !text-white hover:!bg-white hover:!text-[#162936]" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
            <button onClick={onClose} className="text-white hover:text-[#7f9f5f]">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#8494a4]/20 bg-[#dde2df]/30">
          <div className="flex gap-2 px-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'projects'
                  ? 'border-[#7f9f5f] text-[#162936]'
                  : 'border-transparent text-[#747c80] hover:text-[#162936]'
              }`}
            >
              Empreendimentos ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('rentals')}
              className={`px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'rentals'
                  ? 'border-[#7f9f5f] text-[#162936]'
                  : 'border-transparent text-[#747c80] hover:text-[#162936]'
              }`}
            >
              Alugar ({rentals.length})
            </button>
            <button
              onClick={() => setActiveTab('sales')}
              className={`px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'sales'
                  ? 'border-[#7f9f5f] text-[#162936]'
                  : 'border-transparent text-[#747c80] hover:text-[#162936]'
              }`}
            >
              Venda ({sales.length})
            </button>
            <button
              onClick={() => setActiveTab('texts')}
              className={`px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'texts'
                  ? 'border-[#7f9f5f] text-[#162936]'
                  : 'border-transparent text-[#747c80] hover:text-[#162936]'
              }`}
            >
              Textos do Site
            </button>
            <button
              onClick={() => setActiveTab('logo')}
              className={`px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'logo'
                  ? 'border-[#7f9f5f] text-[#162936]'
                  : 'border-transparent text-[#747c80] hover:text-[#162936]'
              }`}
            >
              Logo
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'projects' && (
            <ProjectsTab
              projects={projects}
              setProjects={setProjects}
              backup={projectsBackup}
              onSave={() => saveData('projects', projects)}
              loading={loading}
            />
          )}
          {activeTab === 'rentals' && (
            <PropertiesTab
              title="Gerenciar Imóveis para Alugar"
              properties={rentals}
              setProperties={setRentals}
              backup={rentalsBackup}
              onSave={() => saveData('rentals', rentals)}
              loading={loading}
            />
          )}
          {activeTab === 'sales' && (
            <PropertiesTab
              title="Gerenciar Imóveis para Venda"
              properties={sales}
              setProperties={setSales}
              backup={salesBackup}
              onSave={() => saveData('sales', sales)}
              loading={loading}
            />
          )}
          {activeTab === 'texts' && (
            <SiteTextsTab
              texts={siteTexts}
              setTexts={setSiteTexts}
              loading={loading}
            />
          )}
          {activeTab === 'logo' && (
            <LogoTab
              logoUrl={logoUrl}
              setLogoUrl={setLogoUrl}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ============ TAB: PROJETOS ============
function ProjectsTab({ projects, setProjects, backup, onSave, loading }: any) {
  const [editing, setEditing] = useState<any>(null);

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      name: 'Novo Empreendimento',
      location: 'Petrópolis, RJ',
      status: 'Lançamento',
      image: '',
      premium: false,
      description: 'Descrição do empreendimento',
      features: [],
      units: 'Unidades',
      deliveryDate: '',
      price: 'Sob consulta'
    };

    setProjects([...projects, newProject]);
    setEditing(newProject);
  };

  const deleteProject = (id: number) => {
    const project = projects.find((p: any) => p.id === id);
    if (confirm(`Tem certeza que deseja excluir "${project?.name}"?\n\nEsta ação NÃO pode ser desfeita!`)) {
      setProjects(projects.filter((p: any) => p.id !== id));
      alert('⚠️ Lembre-se de clicar em "Salvar Tudo" para confirmar a exclusão!');
    }
  };

  const updateProject = (updatedProject: any) => {
    // PROTEÇÃO: Criar deep clone para evitar mutações
    const safeUpdate = deepClone(updatedProject);

    // PROTEÇÃO: Verificar se a imagem foi perdida
    const original = projects.find((p: any) => p.id === safeUpdate.id);
    if (original && original.image && !safeUpdate.image) {
      if (!confirm('⚠️ ATENÇÃO: A imagem original será removida!\n\nTem certeza?')) {
        setEditing(null);
        return;
      }
    }

    // PROTEÇÃO: Preservar propriedades que não devem ser perdidas
    const finalUpdate = {
      ...original,
      ...safeUpdate,
      features: safeUpdate.features || original?.features || []
    };

    setProjects(projects.map((p: any) => p.id === finalUpdate.id ? finalUpdate : p));
    setEditing(null);
  };

  const restoreBackup = () => {
    if (confirm('Restaurar dados do último salvamento?\n\nTodas as alterações não salvas serão perdidas!')) {
      setProjects(deepClone(backup));
      alert('✅ Dados restaurados do backup!');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h3 className="text-xl font-bold text-[#162936]">Gerenciar Empreendimentos</h3>
        <div className="flex gap-3 flex-wrap">
          <Button variant="outline" onClick={restoreBackup} disabled={backup.length === 0}>
            Restaurar Backup
          </Button>
          <Button variant="secondary" onClick={addProject}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
          <Button variant="primary" onClick={onSave} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Tudo
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {projects.map((project: any) => (
          <div key={project.id} className="bg-[#dde2df]/30 rounded-xl p-4 border border-[#8494a4]/20">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {project.image ? (
                  <img src={project.image} alt={project.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                ) : (
                  <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-red-500 text-xs">SEM FOTO</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#162936] truncate">{project.name}</h4>
                  <p className="text-sm text-[#747c80] truncate">{project.location}</p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <span className="text-xs bg-[#7f9f5f]/20 text-[#7f9f5f] px-2 py-1 rounded">
                      {project.status}
                    </span>
                    {project.premium && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-700 px-2 py-1 rounded">
                        Premium
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => setEditing(deepClone(project))}
                  className="p-2 hover:bg-[#7f9f5f]/10 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit className="w-5 h-5 text-[#7f9f5f]" />
                </button>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 text-[#747c80]">
          <p className="mb-4">Nenhum empreendimento cadastrado</p>
          <Button variant="secondary" onClick={addProject}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Primeiro Empreendimento
          </Button>
        </div>
      )}

      {editing && (
        <ProjectEditModal
          project={editing}
          onSave={updateProject}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

// ============ MODAL: EDITAR PROJETO ============
function ProjectEditModal({ project, onSave, onClose }: any) {
  const [formData, setFormData] = useState(() => deepClone(project));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // VALIDAÇÃO
    const validation = validateProject(formData);
    if (!validation.valid) {
      alert('⚠️ Erros encontrados:\n\n' + validation.errors.join('\n'));
      return;
    }

    onSave(formData);
  };

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#162936]">Editar Empreendimento</h3>
          <button onClick={onClose} className="text-[#747c80] hover:text-[#162936]">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome *"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            required
          />

          <Input
            label="Localização *"
            value={formData.location}
            onChange={(e) => updateField('location', e.target.value)}
            required
          />

          <Select
            label="Status *"
            value={formData.status}
            onChange={(e) => updateField('status', e.target.value)}
            options={[
              { value: 'Lançamento', label: 'Lançamento' },
              { value: 'Em Construção', label: 'Em Construção' },
              { value: 'Pronto para Morar', label: 'Pronto para Morar' }
            ]}
            required
          />

          <div>
            <label className="block text-sm font-medium text-[#162936] mb-2">
              Imagem Principal * {!formData.image && <span className="text-red-500">(OBRIGATÓRIO)</span>}
            </label>
            <ImageUploader
              onUpload={(url) => updateField('image', url)}
              currentImage={formData.image}
              label=""
            />
          </div>

          <Textarea
            label="Descrição"
            value={formData.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            rows={4}
          />

          <Input
            label="Unidades"
            value={formData.units || ''}
            onChange={(e) => updateField('units', e.target.value)}
            placeholder="Ex: Lotes de 1000m²"
          />

          <Input
            label="Previsão de Entrega"
            value={formData.deliveryDate || ''}
            onChange={(e) => updateField('deliveryDate', e.target.value)}
          />

          <Input
            label="Preço"
            value={formData.price || ''}
            onChange={(e) => updateField('price', e.target.value)}
            placeholder="Ex: A partir de R$ 500.000"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="premium"
              checked={formData.premium || false}
              onChange={(e) => updateField('premium', e.target.checked)}
              className="w-5 h-5 text-[#7f9f5f] rounded"
            />
            <label htmlFor="premium" className="text-[#162936] font-medium">
              Empreendimento Premium (destaque na home)
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#8494a4]/20">
            <Button type="submit" variant="primary" className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============ TAB: IMÓVEIS (ALUGAR/VENDA) ============
function PropertiesTab({ title, properties, setProperties, backup, onSave, loading }: any) {
  const [editing, setEditing] = useState<any>(null);

  const addProperty = () => {
    const newProperty = {
      id: Date.now(),
      title: 'Novo Imóvel',
      location: 'Petrópolis, RJ',
      destination: 'Petrópolis',
      price: 'R$ 5.000',
      period: 'mês',
      bedrooms: 3,
      bathrooms: 2,
      area: '200m²',
      images: [],
      description: 'Descrição do imóvel',
      features: []
    };

    setProperties([...properties, newProperty]);
    setEditing(newProperty);
  };

  const deleteProperty = (id: number) => {
    const property = properties.find((p: any) => p.id === id);
    if (confirm(`Tem certeza que deseja excluir "${property?.title}"?\n\nEsta ação NÃO pode ser desfeita!`)) {
      setProperties(properties.filter((p: any) => p.id !== id));
      alert('⚠️ Lembre-se de clicar em "Salvar Tudo" para confirmar a exclusão!');
    }
  };

  const updateProperty = (updatedProperty: any) => {
    // PROTEÇÃO: Criar deep clone
    const safeUpdate = deepClone(updatedProperty);

    // PROTEÇÃO: Verificar se imagens foram perdidas
    const original = properties.find((p: any) => p.id === safeUpdate.id);
    if (original && original.images?.length > 0 && (!safeUpdate.images || safeUpdate.images.length === 0)) {
      if (!confirm('⚠️ ATENÇÃO: As imagens originais serão removidas!\n\nTem certeza?')) {
        setEditing(null);
        return;
      }
    }

    // PROTEÇÃO: Preservar propriedades
    const finalUpdate = {
      ...original,
      ...safeUpdate,
      images: safeUpdate.images || original?.images || [],
      features: safeUpdate.features || original?.features || []
    };

    setProperties(properties.map((p: any) => p.id === finalUpdate.id ? finalUpdate : p));
    setEditing(null);
  };

  const restoreBackup = () => {
    if (confirm('Restaurar dados do último salvamento?\n\nTodas as alterações não salvas serão perdidas!')) {
      setProperties(deepClone(backup));
      alert('✅ Dados restaurados do backup!');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h3 className="text-xl font-bold text-[#162936]">{title}</h3>
        <div className="flex gap-3 flex-wrap">
          <Button variant="outline" onClick={restoreBackup} disabled={backup.length === 0}>
            Restaurar Backup
          </Button>
          <Button variant="secondary" onClick={addProperty}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
          <Button variant="primary" onClick={onSave} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Tudo
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {properties.map((property: any) => (
          <div key={property.id} className="bg-[#dde2df]/30 rounded-xl p-4 border border-[#8494a4]/20">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {property.images?.[0] ? (
                  <img src={property.images[0]} alt={property.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                ) : (
                  <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-red-500 text-xs">SEM FOTO</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#162936] truncate">{property.title}</h4>
                  <p className="text-sm text-[#747c80] truncate">{property.location}</p>
                  <p className="text-sm text-[#7f9f5f] font-bold">{property.price}/{property.period}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => setEditing(deepClone(property))}
                  className="p-2 hover:bg-[#7f9f5f]/10 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit className="w-5 h-5 text-[#7f9f5f]" />
                </button>
                <button
                  onClick={() => deleteProperty(property.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {properties.length === 0 && (
        <div className="text-center py-12 text-[#747c80]">
          <p className="mb-4">Nenhum imóvel cadastrado</p>
          <Button variant="secondary" onClick={addProperty}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Primeiro Imóvel
          </Button>
        </div>
      )}

      {editing && (
        <PropertyEditModal
          property={editing}
          onSave={updateProperty}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

// ============ MODAL: EDITAR IMÓVEL ============
function PropertyEditModal({ property, onSave, onClose }: any) {
  const [formData, setFormData] = useState(() => {
    const cloned = deepClone(property);
    return {
      ...cloned,
      images: cloned.images || [],
      features: cloned.features || []
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // VALIDAÇÃO
    const validation = validateProperty(formData);
    if (!validation.valid) {
      alert('⚠️ Erros encontrados:\n\n' + validation.errors.join('\n'));
      return;
    }

    onSave(formData);
  };

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImagesChange = (urls: string[]) => {
    updateField('images', urls);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#162936]">Editar Imóvel</h3>
          <button onClick={onClose} className="text-[#747c80] hover:text-[#162936]">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Título *"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            required
          />

          <Input
            label="Localização *"
            value={formData.location}
            onChange={(e) => updateField('location', e.target.value)}
            required
          />

          <Input
            label="Destino (para busca)"
            value={formData.destination || ''}
            onChange={(e) => updateField('destination', e.target.value)}
            placeholder="Ex: Itaipava, Areal, Sebollas"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Preço *"
              value={formData.price}
              onChange={(e) => updateField('price', e.target.value)}
              placeholder="Ex: R$ 5.000"
              required
            />

            <Input
              label="Período"
              value={formData.period || ''}
              onChange={(e) => updateField('period', e.target.value)}
              placeholder="Ex: mês, à vista"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Quartos"
              type="number"
              value={formData.bedrooms || 0}
              onChange={(e) => updateField('bedrooms', parseInt(e.target.value) || 0)}
            />

            <Input
              label="Banheiros"
              type="number"
              value={formData.bathrooms || 0}
              onChange={(e) => updateField('bathrooms', parseInt(e.target.value) || 0)}
            />

            <Input
              label="Área"
              value={formData.area || ''}
              onChange={(e) => updateField('area', e.target.value)}
              placeholder="Ex: 200m²"
            />
          </div>

          <Textarea
            label="Descrição"
            value={formData.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            rows={4}
          />

          <div className="space-y-4 border-t border-[#8494a4]/20 pt-4">
            <MultiImageUploader
              onImagesChange={handleImagesChange}
              currentImages={formData.images || []}
              maxImages={10}
              label="Imagens do Imóvel (até 10 imagens)"
            />
            {(!formData.images || formData.images.length === 0) && (
              <p className="text-sm text-red-500">⚠️ Adicione pelo menos 1 imagem para o imóvel!</p>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#8494a4]/20">
            <Button type="submit" variant="primary" className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============ TAB: TEXTOS DO SITE ============
function SiteTextsTab({ texts, setTexts, loading }: any) {
  const [saving, setSaving] = useState(false);

  const saveTexts = async (data?: any) => {
    const payload = data ?? texts;
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/site-texts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        alert('✅ Textos salvos com sucesso!\n\n🔄 O site será atualizado automaticamente em segundos.');
        try {
          const bc = new BroadcastChannel('teto-terra-admin');
          bc.postMessage({ type: 'DATA_UPDATED', dataType: 'site-texts', timestamp: Date.now() });
          bc.close();
        } catch (_) {}
      } else {
        alert('❌ Erro ao salvar: ' + result.message);
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('❌ Erro ao salvar textos');
    } finally {
      setSaving(false);
    }
  };

  const updateText = (field: string, value: string) => {
    setTexts({ ...texts, [field]: value });
  };

  const handleImageUpload = (field: string, url: string) => {
    const updated = { ...texts, [field]: url };
    setTexts(updated);
    saveTexts(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-[#162936]">Editar Textos do Site</h3>
        <Button variant="primary" onClick={() => saveTexts()} disabled={saving || loading}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Salvando...' : 'Salvar Textos'}
        </Button>
      </div>

      <div className="space-y-6">
        <div className="bg-[#dde2df]/30 rounded-xl p-6 border border-[#8494a4]/20">
          <h4 className="font-bold text-[#162936] mb-4">Imagens do Site</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUploader
              onUpload={(url) => handleImageUpload('heroImage', url)}
              currentImage={texts.heroImage || ''}
              label="Imagem de Fundo (Seção Hero)"
            />
            <ImageUploader
              onUpload={(url) => handleImageUpload('aboutImage', url)}
              currentImage={texts.aboutImage || ''}
              label="Imagem da Seção Sobre"
            />
          </div>
        </div>

        <div className="bg-[#dde2df]/30 rounded-xl p-6 border border-[#8494a4]/20">
          <h4 className="font-bold text-[#162936] mb-4">Seção Hero (Topo)</h4>

          <div className="space-y-4">
            <Textarea
              label="Título Principal"
              value={texts.heroTitle || ''}
              onChange={(e) => updateText('heroTitle', e.target.value)}
              placeholder="Seu refúgio na serra.\nSeu investimento com futuro."
              rows={3}
            />

            <Input
              label="Subtítulo"
              value={texts.heroSubtitle || ''}
              onChange={(e) => updateText('heroSubtitle', e.target.value)}
              placeholder="Empreendimentos exclusivos em Petrópolis e Região Serrana"
            />

            <Input
              label="Nome da Empresa"
              value={texts.heroCompany || ''}
              onChange={(e) => updateText('heroCompany', e.target.value)}
              placeholder="Teto & Terra Real Estate | Especializada em Petrópolis e Região Serrana"
            />
          </div>
        </div>

        <div className="bg-[#dde2df]/30 rounded-xl p-6 border border-[#8494a4]/20">
          <h4 className="font-bold text-[#162936] mb-4">Seção Sobre</h4>

          <div className="space-y-4">
            <Input
              label="Título da Seção"
              value={texts.aboutTitle || ''}
              onChange={(e) => updateText('aboutTitle', e.target.value)}
              placeholder="Construindo Excelência na Serra"
            />

            <Textarea
              label="Primeiro Parágrafo"
              value={texts.aboutText1 || ''}
              onChange={(e) => updateText('aboutText1', e.target.value)}
              rows={3}
            />

            <Textarea
              label="Segundo Parágrafo"
              value={texts.aboutText2 || ''}
              onChange={(e) => updateText('aboutText2', e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="bg-[#dde2df]/30 rounded-xl p-6 border border-[#8494a4]/20">
          <h4 className="font-bold text-[#162936] mb-4">Seção Investir</h4>

          <div className="space-y-4">
            <Input
              label="Título da Seção"
              value={texts.investTitle || ''}
              onChange={(e) => updateText('investTitle', e.target.value)}
              placeholder="Oportunidades de Investimento"
            />

            <Textarea
              label="Descrição"
              value={texts.investDescription || ''}
              onChange={(e) => updateText('investDescription', e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="bg-[#dde2df]/30 rounded-xl p-6 border border-[#8494a4]/20">
          <h4 className="font-bold text-[#162936] mb-4">Seção Contato</h4>

          <div className="space-y-4">
            <Input
              label="Título da Seção"
              value={texts.contactTitle || ''}
              onChange={(e) => updateText('contactTitle', e.target.value)}
              placeholder="Agende uma Visita"
            />

            <Textarea
              label="Descrição"
              value={texts.contactDescription || ''}
              onChange={(e) => updateText('contactDescription', e.target.value)}
              rows={2}
            />

            <Input
              label="Telefone WhatsApp"
              value={texts.phone || ''}
              onChange={(e) => updateText('phone', e.target.value)}
              placeholder="(24) 99999-9999"
            />

            <Input
              label="Email de Contato"
              value={texts.email || ''}
              onChange={(e) => updateText('email', e.target.value)}
              placeholder="tetoeterrarealstate@hotmail.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ TAB: LOGO ============
function LogoTab({ logoUrl, setLogoUrl, loading }: any) {
  const [saving, setSaving] = useState(false);

  const saveLogo = async (url: string) => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/logo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ url })
      });

      const result = await response.json();

      if (result.success) {
        alert('✅ Logo salvo com sucesso!\n\n🔄 O site será atualizado automaticamente em segundos.');
        try {
          const bc = new BroadcastChannel('teto-terra-admin');
          bc.postMessage({ type: 'DATA_UPDATED', dataType: 'logo', timestamp: Date.now() });
          bc.close();
        } catch (_) {}
      } else {
        alert('❌ Erro ao salvar: ' + result.message);
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('❌ Erro ao salvar logo');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = (url: string) => {
    setLogoUrl(url);
    saveLogo(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-[#162936]">Alterar Logo</h3>
        {saving && (
          <span className="text-sm text-[#7f9f5f]">Salvando automaticamente...</span>
        )}
      </div>

      <div className="bg-[#dde2df]/30 rounded-xl p-6 border border-[#8494a4]/20">
        <p className="text-sm text-[#747c80] mb-6">
          Faça upload do novo logo do site. O logo será salvo automaticamente após o upload.<br/>
          Tamanho recomendado: 200x60px (formato PNG com fundo transparente).
        </p>

        <ImageUploader
          onUpload={handleLogoUpload}
          currentImage={logoUrl}
          label="Logo do Site"
          accept="image/png,image/svg+xml,image/webp"
        />

        {logoUrl && (
          <div className="mt-6 p-4 bg-white rounded-lg border border-[#8494a4]/20">
            <p className="text-sm font-medium text-[#162936] mb-2">Preview atual:</p>
            <img src={logoUrl} alt="Logo" className="h-12 object-contain" />
          </div>
        )}
      </div>
    </div>
  );
}
