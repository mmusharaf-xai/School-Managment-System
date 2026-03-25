import { getDb } from '../../db/connection';
import { schools } from '../../db/schema';
import { eq } from 'drizzle-orm';

export interface QuickAccessStat {
  id: string;
  label: string;
  value: string;
  icon: string;
  color: string;
}

export interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  route?: string;
}

export interface SetupProgress {
  percentage: number;
  message: string;
  ctaText: string;
  ctaAction: string;
}

export interface QuickAccessConfig {
  school: {
    id: number;
    name: string;
  };
  welcomeMessage: string;
  stats: QuickAccessStat[];
  quickActions: QuickAction[];
  setupProgress?: SetupProgress;
}

export interface QuickAccessResult {
  success: boolean;
  config?: QuickAccessConfig;
  error?: string;
}

/**
 * Fetch quick access UI configuration for a school
 * This simulates a server-side driven UI where the config comes from API
 */
export const getQuickAccessConfig = async (schoolId: number): Promise<QuickAccessResult> => {
  try {
    const db = getDb();

    // Fetch school details
    const schoolResult = await db
      .select()
      .from(schools)
      .where(eq(schools.id, schoolId))
      .limit(1);

    if (schoolResult.length === 0) {
      return { success: false, error: 'School not found' };
    }

    const school = schoolResult[0];

    // TODO: In production, these stats would come from the database
    // For now, we'll return placeholder values
    const config: QuickAccessConfig = {
      school: {
        id: school.id,
        name: school.name,
      },
      welcomeMessage: "Welcome back! Here's an overview of your school.",
      stats: [
        {
          id: 'students',
          label: 'STUDENTS',
          value: '124',
          icon: 'people',
          color: '#2563eb',
        },
        {
          id: 'staffs',
          label: 'STAFFS',
          value: '12',
          icon: 'briefcase',
          color: '#f59e0b',
        },
        {
          id: 'revenue',
          label: 'REVENUE',
          value: '$0.00',
          icon: 'cash',
          color: '#10b981',
        },
        {
          id: 'classes',
          label: 'CLASSES',
          value: '8',
          icon: 'school',
          color: '#8b5cf6',
        },
      ],
      quickActions: [
        {
          id: 'enroll_student',
          title: 'Enroll New Student',
          subtitle: 'Quick registration for new admissions',
          icon: 'person-add',
          route: 'enroll_student',
        },
        {
          id: 'generate_fee',
          title: 'Generate Fee Invoice',
          subtitle: 'Create billing for any class or student',
          icon: 'document-text',
          route: 'generate_fee',
        },
        {
          id: 'class_timetable',
          title: 'Class Timetable',
          subtitle: 'Manage daily schedules and periods',
          icon: 'calendar',
          route: 'class_timetable',
        },
      ],
      setupProgress: {
        percentage: 50,
        message: "You're 50% through setting up your school profile.",
        ctaText: 'Add Staff',
        ctaAction: 'add_staff',
      },
    };

    return { success: true, config };
  } catch (error) {
    console.error('Get quick access config error:', error);
    return { success: false, error: 'Failed to fetch quick access configuration' };
  }
};
