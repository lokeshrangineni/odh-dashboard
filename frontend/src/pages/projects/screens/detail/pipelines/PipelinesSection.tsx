import * as React from 'react';
import { ButtonVariant, Popover } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { ProjectSectionID } from '~/pages/projects/screens/detail/types';
import { AccessReviewResource, ProjectSectionTitles } from '~/pages/projects/screens/detail/const';
import { PipelineServerTimedOut, usePipelinesAPI } from '~/concepts/pipelines/context';
import ImportPipelineSplitButton from '~/concepts/pipelines/content/import/ImportPipelineSplitButton';
import PipelinesList from '~/pages/projects/screens/detail/pipelines/PipelinesList';
import PipelineServerActions from '~/concepts/pipelines/content/PipelineServerActions';
import { useAccessReview } from '~/api';
import { ProjectDetailsContext } from '~/pages/projects/ProjectDetailsContext';
import DetailsSection from '~/pages/projects/screens/detail/DetailsSection';
import DashboardPopupIconButton from '~/concepts/dashboard/DashboardPopupIconButton';
import { ProjectObjectType } from '~/concepts/design/utils';
import NoPipelineServer from '~/concepts/pipelines/NoPipelineServer';
import PipelineAndVersionContextProvider from '~/concepts/pipelines/content/PipelineAndVersionContext';
import EnsureCompatiblePipelineServer from '~/concepts/pipelines/EnsureCompatiblePipelineServer';

const PipelinesSection: React.FC = () => {
  const { currentProject } = React.useContext(ProjectDetailsContext);
  const {
    apiAvailable,
    pipelinesServer: { initializing, installed, timedOut, compatible },
  } = usePipelinesAPI();
  const [isPipelinesEmpty, setIsPipelinesEmpty] = React.useState(false);
  const [allowCreate, rbacLoaded] = useAccessReview({
    ...AccessReviewResource,
    namespace: currentProject.metadata.name,
  });

  const hideImportButton = installed && !compatible;

  const actions: React.ComponentProps<typeof DetailsSection>['actions'] = [];
  if (!hideImportButton) {
    actions.push(
      <ImportPipelineSplitButton
        disable={!installed}
        disableUploadVersion={installed && isPipelinesEmpty}
        key={`action-${ProjectSectionID.PIPELINES}`}
        variant="secondary"
      />,
    );
  }
  actions.push(
    <PipelineServerActions
      key={`action-${ProjectSectionID.PIPELINES}-1`}
      isDisabled={!initializing && !installed}
      variant="kebab"
    />,
  );

  return (
    <PipelineAndVersionContextProvider>
      <DetailsSection
        id={ProjectSectionID.PIPELINES}
        objectType={ProjectObjectType.pipeline}
        title={ProjectSectionTitles[ProjectSectionID.PIPELINES]}
        data-testid={ProjectSectionID.PIPELINES}
        popover={
          installed ? (
            <Popover
              headerContent="About pipelines"
              bodyContent="Standardize and automate machine learning workflows to enable you to further enhance and deploy your data science models."
            >
              <DashboardPopupIconButton
                icon={<OutlinedQuestionCircleIcon />}
                aria-label="More info"
              />
            </Popover>
          ) : null
        }
        actions={actions}
        isLoading={(compatible && !apiAvailable && installed) || initializing}
        isEmpty={!installed}
        emptyState={
          <NoPipelineServer
            variant={ButtonVariant.primary}
            allowCreate={rbacLoaded && allowCreate}
          />
        }
        showDivider={isPipelinesEmpty}
      >
        <EnsureCompatiblePipelineServer>
          {timedOut ? (
            <PipelineServerTimedOut />
          ) : installed ? (
            <PipelinesList setIsPipelinesEmpty={setIsPipelinesEmpty} />
          ) : null}
        </EnsureCompatiblePipelineServer>
      </DetailsSection>
    </PipelineAndVersionContextProvider>
  );
};

export default PipelinesSection;
