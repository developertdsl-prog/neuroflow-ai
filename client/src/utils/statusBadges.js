export const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'COMPLETED':
    case 'SUCCESS':
      return { bg: 'rgba(16, 185, 129, 0.2)', color: '#10b981' };
    case 'RUNNING':
      return { bg: 'rgba(0, 242, 254, 0.2)', color: '#00f2fe' };
    case 'PENDING':
      return { bg: 'rgba(148, 163, 184, 0.2)', color: '#94a3b8' };
    case 'FAILED':
    case 'HALTED_SAFETY':
      return { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' };
    default:
      return { bg: 'rgba(148, 163, 184, 0.2)', color: '#94a3b8' };
  }
};
