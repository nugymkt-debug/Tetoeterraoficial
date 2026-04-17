/**
 * Auth simplíssima pro painel admin.
 * A senha é lida de uma env Vite (VITE_ADMIN_PASSWORD). Se não estiver
 * definida, cai num fallback pra primeiro acesso — TROQUE antes de publicar.
 *
 * Como trocar a senha (qualquer uma das opções):
 *  1. Crie um arquivo .env com: VITE_ADMIN_PASSWORD=minhasenha-segura
 *  2. Ou edite o FALLBACK abaixo.
 *
 * Segurança: isso roda no browser. Para um painel realmente seguro, é
 * preciso backend + token. Aqui é o bastante pra proteger de visitas casuais.
 */

const FALLBACK_PASSWORD = 'tetoeterra-2026'
const SESSION_KEY = 'tt_admin_session_v1'

export function getAdminPassword(): string {
  return (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) || FALLBACK_PASSWORD
}

export function login(password: string): boolean {
  const ok = password === getAdminPassword()
  if (ok) sessionStorage.setItem(SESSION_KEY, '1')
  return ok
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY)
}

export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem(SESSION_KEY) === '1'
}
