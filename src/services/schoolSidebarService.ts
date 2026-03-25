import { SidebarMenuItem } from '../components/school';

export interface SchoolSidebarConfig {
  schoolId: number;
  schoolName: string;
  menuItems: SidebarMenuItem[];
}

/**
 * Get default menu items for school sidebar
 * In production, this would come from the backend API
 */
export const getDefaultMenuItems = (userRole: string = 'owner'): SidebarMenuItem[] => {
  const allItems: SidebarMenuItem[] = [
    {
      id: 'quick_access',
      label: 'Quick Access',
      icon: 'grid',
      route: 'QuickAccess',
      accessible: true,
    },
    {
      id: 'staffs',
      label: 'Staffs',
      icon: 'people',
      route: 'Staffs',
      accessible: userRole === 'owner' || userRole === 'admin',
    },
    {
      id: 'students',
      label: 'Students',
      icon: 'person',
      route: 'Students',
      accessible: userRole === 'owner' || userRole === 'admin' || userRole === 'teacher',
    },
    {
      id: 'assets',
      label: 'Assets',
      icon: 'cube',
      route: 'Assets',
      accessible: userRole === 'owner' || userRole === 'admin',
    },
    {
      id: 'invoices',
      label: 'Invoices',
      icon: 'receipt',
      route: 'Invoices',
      accessible: userRole === 'owner' || userRole === 'admin',
    },
    {
      id: 'classes',
      label: 'Classes',
      icon: 'school',
      route: 'Classes',
      accessible: userRole === 'owner' || userRole === 'admin' || userRole === 'teacher',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings',
      route: 'Settings',
      accessible: userRole === 'owner' || userRole === 'admin',
    },
  ];

  return allItems;
};

/**
 * Fetch sidebar configuration for a school
 * This simulates a server-side driven UI where the config comes from API
 */
export const getSchoolSidebarConfig = async (
  schoolId: number,
  userRole: string = 'owner'
): Promise<SchoolSidebarConfig> => {
  // TODO: In production, fetch from API
  // For now, return default config

  const menuItems = getDefaultMenuItems(userRole);

  // Default school name (would come from API)
  const schoolName = 'School';

  return {
    schoolId,
    schoolName,
    menuItems,
  };
};
