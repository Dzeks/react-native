import { CoopleJobsResponse, PublicJob, CoopleJobsRequest } from '~/types/jobs';

export const fetchPublicJobs = async (request: CoopleJobsRequest): Promise<{items: PublicJob[], total: number}> => {
  const { pageNum, pageSize } = request;
  // Add a delay to simulate a real API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  const response = await fetch(
    `https://www.coople.com/ch/resources/api/work-assignments/public-jobs/list?pageNum=${pageNum}&pageSize=${pageSize}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: CoopleJobsResponse = await response.json();

  if (result.error) {
    console.error('API Error:', result.errorCode, result.errorDetails);
    throw new Error(result.errorCode || 'API returned an error');
  }

  return result.data;
}; 