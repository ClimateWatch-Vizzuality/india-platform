import climatePoliciesDetailHeader from 'components/climate-policies-detail-header';

export default [
  {
    slug: 'overview',
    label: 'Overview',
    link: '/climate-policies/:policy/overview',
    default: true,
    header: climatePoliciesDetailHeader
  },
  {
    slug: 'instruments',
    label: 'Instruments',
    path: '/climate-policies/:policy/instruments',
    default: false,
    header: climatePoliciesDetailHeader
  },
  {
    slug: 'milestones',
    label: 'Milestones',
    path: '/climate-policies/:policy/milestones',
    default: false,
    header: climatePoliciesDetailHeader
  },
  {
    slug: 'indicators',
    label: 'Indicators',
    path: '/climate-policies/:policy/indicators',
    default: false,
    header: climatePoliciesDetailHeader
  },
  {
    slug: 'progress',
    label: 'Snapshot of progress',
    path: '/climate-policies/:policy/progress',
    default: false,
    header: climatePoliciesDetailHeader
  }
];
