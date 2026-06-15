import { getPayloadClient } from './payload'
import { defaultNavLeft, defaultNavRight, type NavItem } from '@/components/layout/Header'

function resolveMenuHref(item: any): string {
  if (item?.tipoLink === 'pagina') {
    const slug = typeof item.pagina === 'string' ? item.pagina : item.pagina?.slug
    return slug ? `/${slug}` : ''
  }
  if (item?.tipoLink === 'externo') return item.url || ''
  return item?.rota || ''
}

function mapMenuItem(item: any): NavItem {
  const submenu = Array.isArray(item.submenu) ? item.submenu : []

  if (submenu.length > 0) {
    return {
      label: item.label,
      children: submenu.map((child: any) => ({
        href: resolveMenuHref(child),
        label: child.label,
      })),
    }
  }

  return { href: resolveMenuHref(item), label: item.label }
}

export async function getNavigation(): Promise<{ navLeft: NavItem[]; navRight: NavItem[] }> {
  try {
    const payload = await getPayloadClient()
    const nav = await payload.findGlobal({ slug: 'navigation' as any, depth: 1 })

    const menuPrincipal = (nav as any)?.menuPrincipal || []
    const menuSecundario = (nav as any)?.menuSecundario || []

    if (menuPrincipal.length === 0 && menuSecundario.length === 0) {
      return { navLeft: defaultNavLeft, navRight: defaultNavRight }
    }

    return {
      navLeft: menuPrincipal.map(mapMenuItem),
      navRight: menuSecundario.map(mapMenuItem),
    }
  } catch {
    return { navLeft: defaultNavLeft, navRight: defaultNavRight }
  }
}
