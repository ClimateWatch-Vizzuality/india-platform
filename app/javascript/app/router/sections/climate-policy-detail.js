import climatePoliciesDetailHeader from 'components/climate-policies-detail-header';

export default [
  {
    slug: 'overview',
    label: 'Overview',
    link: '/overview',
    default: true,
    header: climatePoliciesDetailHeader
  },
  {
    slug: 'instruments',
    label: 'Instruments',
    path: '/instruments',
    default: false,
    header: climatePoliciesDetailHeader
  },
  {
    slug: 'milestones',
    label: 'Milestones',
    path: '/milestones',
    default: false,
    header: climatePoliciesDetailHeader
  },
  {
    slug: 'indicators',
    label: 'Indicators',
    path: '/indicators',
    default: false,
    header: climatePoliciesDetailHeader
  },
  {
    slug: 'progress',
    label: 'Snapshot of progress',
    path: '/progress',
    default: false,
    header: climatePoliciesDetailHeader
  }
];
