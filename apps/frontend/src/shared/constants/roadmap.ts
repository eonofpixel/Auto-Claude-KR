/**
 * Roadmap-related constants
 * Feature priority, complexity, and impact indicators
 */

// ============================================
// Roadmap Priority
// ============================================

// Translation keys for priority labels (use with t() from react-i18next)
export const ROADMAP_PRIORITY_LABEL_KEYS: Record<string, string> = {
  must: 'common:roadmapFeature.priority.must',
  should: 'common:roadmapFeature.priority.should',
  could: 'common:roadmapFeature.priority.could',
  wont: 'common:roadmapFeature.priority.wont'
};

// Fallback labels for non-i18n contexts
export const ROADMAP_PRIORITY_LABELS: Record<string, string> = {
  must: 'Must Have',
  should: 'Should Have',
  could: 'Could Have',
  wont: "Won't Have"
};

export const ROADMAP_PRIORITY_COLORS: Record<string, string> = {
  must: 'bg-destructive/10 text-destructive border-destructive/30',
  should: 'bg-warning/10 text-warning border-warning/30',
  could: 'bg-info/10 text-info border-info/30',
  wont: 'bg-muted text-muted-foreground border-muted'
};

// ============================================
// Roadmap Complexity
// ============================================

// Translation keys for complexity labels (use with t() from react-i18next)
export const ROADMAP_COMPLEXITY_LABEL_KEYS: Record<string, string> = {
  low: 'common:roadmapFeature.complexity.low',
  medium: 'common:roadmapFeature.complexity.medium',
  high: 'common:roadmapFeature.complexity.high'
};

// Fallback labels for non-i18n contexts
export const ROADMAP_COMPLEXITY_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High'
};

export const ROADMAP_COMPLEXITY_COLORS: Record<string, string> = {
  low: 'bg-success/10 text-success',
  medium: 'bg-warning/10 text-warning',
  high: 'bg-destructive/10 text-destructive'
};

// ============================================
// Roadmap Impact
// ============================================

// Translation keys for impact labels (use with t() from react-i18next)
export const ROADMAP_IMPACT_LABEL_KEYS: Record<string, string> = {
  low: 'common:roadmapFeature.impact.low',
  medium: 'common:roadmapFeature.impact.medium',
  high: 'common:roadmapFeature.impact.high'
};

// Fallback labels for non-i18n contexts
export const ROADMAP_IMPACT_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High'
};

export const ROADMAP_IMPACT_COLORS: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-info/10 text-info',
  high: 'bg-success/10 text-success'
};

// ============================================
// Roadmap Status (for Kanban columns)
// ============================================

export interface RoadmapStatusColumn {
  id: string;
  label: string;
  color: string;
  icon: string;
}

export const ROADMAP_STATUS_COLUMNS: RoadmapStatusColumn[] = [
  { id: 'under_review', label: 'Under Review', color: 'border-t-muted-foreground/50', icon: 'Eye' },
  { id: 'planned', label: 'Planned', color: 'border-t-info', icon: 'Calendar' },
  { id: 'in_progress', label: 'In Progress', color: 'border-t-primary', icon: 'Play' },
  { id: 'done', label: 'Done', color: 'border-t-success', icon: 'Check' }
];

// Translation keys for status labels (use with t() from react-i18next)
export const ROADMAP_STATUS_LABEL_KEYS: Record<string, string> = {
  under_review: 'common:roadmapFeature.status.underReview',
  planned: 'common:roadmapFeature.status.planned',
  in_progress: 'common:roadmapFeature.status.inProgress',
  done: 'common:roadmapFeature.status.done',
  completed: 'common:roadmapFeature.status.completed'
};

// Fallback labels for non-i18n contexts
export const ROADMAP_STATUS_LABELS: Record<string, string> = {
  under_review: 'Under Review',
  planned: 'Planned',
  in_progress: 'In Progress',
  done: 'Done',
  completed: 'Completed'
};

export const ROADMAP_STATUS_COLORS: Record<string, string> = {
  under_review: 'bg-muted text-muted-foreground',
  planned: 'bg-info/10 text-info',
  in_progress: 'bg-primary/10 text-primary',
  done: 'bg-success/10 text-success',
  completed: 'bg-success/10 text-success'
};
