import * as React from 'react';
import {
  FormGroup,
  InputGroup,
  InputGroupText,
  TextInput,
  InputGroupItem,
  FormHelperText,
  HelperText,
  HelperTextItem,
} from '@patternfly/react-core';
import { MountPath } from '~/pages/projects/types';

type MountPathFieldProps = {
  inUseMountPaths: string[];
  mountPath: MountPath;
  setMountPath: (mountPath: MountPath) => void;
};

const MountPathField: React.FC<MountPathFieldProps> = ({
  inUseMountPaths,
  mountPath,
  setMountPath,
}) => (
  <FormGroup isRequired label="Mount folder name">
    <InputGroup>
      <InputGroupText isPlain>/</InputGroupText>
      <InputGroupItem isFill>
        <TextInput
          isRequired
          aria-label="mount-path-folder-value"
          type="text"
          value={mountPath.value}
          placeholder="eg. data"
          validated={mountPath.error ? 'error' : 'default'}
          onChange={(e, value) => {
            let error = '';
            if (value.length === 0) {
              error = 'Required';
            } else if (!/^[a-z-]+$/.test(value)) {
              error = 'Must only consist of lower case letters and dashes';
            } else if (inUseMountPaths.includes(`/${value}`)) {
              error = 'Mount folder is already in use for this workbench';
            }
            setMountPath({ value, error });
          }}
        />
      </InputGroupItem>
    </InputGroup>
    <FormHelperText>
      <HelperText>
        <HelperTextItem variant={mountPath.error ? 'error' : 'default'}>
          {mountPath.error
            ? 'Enter a path to a model or folder. This path cannot point to a root folder.'
            : 'Must consist of lower case letters and dashes.'}
        </HelperTextItem>
      </HelperText>
    </FormHelperText>
  </FormGroup>
);

export default MountPathField;
