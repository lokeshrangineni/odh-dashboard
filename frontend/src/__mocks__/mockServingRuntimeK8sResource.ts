import { KnownLabels, ServingRuntimeKind } from '~/k8sTypes';
import { ServingRuntimeAPIProtocol, ContainerResources } from '~/types';

type MockResourceConfigType = {
  name?: string;
  displayName?: string;
  templateName?: string;
  templateDisplayName?: string;
  namespace?: string;
  replicas?: number;
  auth?: boolean;
  route?: boolean;
  acceleratorName?: string;
  apiProtocol?: ServingRuntimeAPIProtocol;
  resources?: ContainerResources;
  disableResources?: boolean;
  disableReplicas?: boolean;
  disableModelMeshAnnotations?: boolean;
};

export const mockServingRuntimeK8sResourceLegacy = ({
  name = 'test-model-legacy',
  namespace = 'test-project',
  replicas = 0,
  auth = false,
  route = false,
}: MockResourceConfigType): ServingRuntimeKind => ({
  apiVersion: 'serving.kserve.io/v1alpha1',
  kind: 'ServingRuntime',
  metadata: {
    creationTimestamp: '2023-03-17T16:05:55Z',
    labels: {
      name,
      [KnownLabels.DASHBOARD_RESOURCE]: 'true',
    },
    annotations: {
      'enable-auth': auth ? 'true' : 'false',
      'enable-route': route ? 'true' : 'false',
    },
    name,
    namespace,
  },
  spec: {
    builtInAdapter: {
      memBufferBytes: 134217728,
      modelLoadingTimeoutMillis: 90000,
      runtimeManagementPort: 8888,
      serverType: 'ovms',
    },
    containers: [
      {
        args: [
          '--port=8001',
          '--rest_port=8888',
          '--config_path=/models/model_config_list.json',
          '--file_system_poll_wait_seconds=0',
          '--grpc_bind_address=127.0.0.1',
          '--rest_bind_address=127.0.0.1',
        ],
        image:
          'registry.redhat.io/openshift-ai/odh-openvino-servingruntime-rhel8@sha256:8af20e48bb480a7ba1ee1268a3cf0a507e05b256c5fcf988f8e4a3de8b87edc6',
        name: 'ovms',
        resources: {
          limits: {
            cpu: '2',
            memory: '8Gi',
          },
          requests: {
            cpu: '1',
            memory: '4Gi',
          },
        },
      },
    ],
    grpcDataEndpoint: 'port:8001',
    grpcEndpoint: 'port:8085',
    multiModel: true,
    protocolVersions: ['grpc-v1'],
    replicas,
    supportedModelFormats: [
      {
        autoSelect: true,
        name: 'openvino_ir',
        version: 'opset1',
      },
      {
        autoSelect: true,
        name: 'onnx',
        version: '1',
      },
    ],
  },
});

export const mockServingRuntimeK8sResource = ({
  name = 'test-model',
  namespace = 'test-project',
  replicas = 0,
  auth = false,
  route = false,
  displayName = 'OVMS Model Serving',
  templateName = 'ovms',
  templateDisplayName = 'OpenVINO Serving Runtime (Supports GPUs)',
  acceleratorName = '',
  apiProtocol = ServingRuntimeAPIProtocol.REST,
  resources = {
    limits: {
      cpu: '2',
      memory: '8Gi',
    },
    requests: {
      cpu: '1',
      memory: '4Gi',
    },
  },
  disableResources = false,
  disableReplicas = false,
  disableModelMeshAnnotations = false,
}: MockResourceConfigType): ServingRuntimeKind => ({
  apiVersion: 'serving.kserve.io/v1alpha1',
  kind: 'ServingRuntime',
  metadata: {
    creationTimestamp: '2023-06-22T16:05:55Z',
    labels: {
      name,
      [KnownLabels.DASHBOARD_RESOURCE]: 'true',
    },
    annotations: {
      'opendatahub.io/template-display-name': templateDisplayName,
      'opendatahub.io/accelerator-name': acceleratorName,
      'opendatahub.io/template-name': templateName,
      'openshift.io/display-name': displayName,
      'opendatahub.io/apiProtocol': apiProtocol,
      ...(!disableModelMeshAnnotations && {
        'enable-auth': auth ? 'true' : 'false',
        'enable-route': route ? 'true' : 'false',
      }),
    },
    name,
    namespace,
  },
  spec: {
    builtInAdapter: {
      memBufferBytes: 134217728,
      modelLoadingTimeoutMillis: 90000,
      runtimeManagementPort: 8888,
      serverType: 'ovms',
    },
    containers: [
      {
        args: [
          '--port=8001',
          '--rest_port=8888',
          '--config_path=/models/model_config_list.json',
          '--file_system_poll_wait_seconds=0',
          '--grpc_bind_address=127.0.0.1',
          '--rest_bind_address=127.0.0.1',
          '--target_device=NVIDIA',
        ],
        image:
          'registry.redhat.io/openshift-ai/odh-openvino-servingruntime-rhel8@sha256:8af20e48bb480a7ba1ee1268a3cf0a507e05b256c5fcf988f8e4a3de8b87edc6',
        name: 'ovms',
        affinity: {},
        volumeMounts: [{ name: 'shm', mountPath: '/dev/shm' }],
        ...(!disableResources && { resources }),
      },
    ],
    grpcDataEndpoint: 'port:8001',
    grpcEndpoint: 'port:8085',
    multiModel: true,
    protocolVersions: ['grpc-v1'],
    ...(!disableReplicas && { replicas }),
    supportedModelFormats: [
      {
        autoSelect: true,
        name: 'openvino_ir',
        version: 'opset1',
      },
      {
        autoSelect: true,
        name: 'onnx',
        version: '1',
      },
    ],
    volumes: [{ name: 'shm', emptyDir: { medium: 'Memory', sizeLimit: '2Gi' } }],
  },
});
