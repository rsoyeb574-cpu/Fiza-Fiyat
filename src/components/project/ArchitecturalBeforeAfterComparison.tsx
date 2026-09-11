import React from 'react';
import { BeforeAfter, BeforeAfterScheme } from './BeforeAfter';
import { Project } from '../../types';
import { NormalizedProjectSpecs } from '../../utils/projectComparison';
import { ArchitecturalDesignConcept } from '../../types/designIteration';

export type ComparisonScheme = BeforeAfterScheme;

export interface ArchitecturalBeforeAfterComparisonProps {
  project: Project;
  specs?: NormalizedProjectSpecs;
  onOpenAiIterationModal?: () => void;
  activeGeneratedConcepts?: ArchitecturalDesignConcept[];
  onAdoptScheme?: (scheme: ComparisonScheme) => void;
  className?: string;
  initialMode?: 'slider' | 'toggle' | 'sideBySide' | 'blend';
}

export const ArchitecturalBeforeAfterComparison: React.FC<ArchitecturalBeforeAfterComparisonProps> = ({
  project,
  specs,
  onOpenAiIterationModal,
  activeGeneratedConcepts,
  onAdoptScheme,
  className = '',
  initialMode = 'slider'
}) => {
  return (
    <BeforeAfter
      project={project}
      specs={specs}
      onOpenAiIterationModal={onOpenAiIterationModal}
      activeGeneratedConcepts={activeGeneratedConcepts}
      onAdoptIteration={onAdoptScheme}
      className={className}
      initialMode={initialMode}
    />
  );
};

export default ArchitecturalBeforeAfterComparison;
