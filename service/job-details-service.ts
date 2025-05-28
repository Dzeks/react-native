// service/job-details-service.ts

interface ApiWage {
    amount: number;
    currencyId: number;
}

interface ApiJobSkill {
    jobProfileId: number;
    educationalLevelId: number;
}

interface ApiJobLocation {
    addressStreet: string;
    extraAddress: string;
    zip: string;
    city: string;
    state: string;
    countryId: number;
}

export interface ApiJobData {
    workAssignmentId: string;
    waReadableId: string;
    hourlyWage: ApiWage;
    salary: ApiWage; // Based on API example: {"amount":3996.00,"currencyId":1}
    jobSkill: ApiJobSkill;
    workAssignmentName: string;
    jobLocation: ApiJobLocation;
    periodFrom: number;
    datePublished: number;
    branchLink: string;
    requirements: string;
    clothingRequirements: string;
    periodTo: number;
    firstShiftTo: number;
    shiftsCount: number;
    workDuration: number; // e.g. 8880 from API example
}

export interface JobDetailsApiResponse {
    status: number;
    data: ApiJobData;
    errorCode: string;
    errorDetails: Record<string, unknown>;
    errorId: number;
    error: boolean;
}

const API_BASE_URL = 'https://www.coople.com/ch/resources/api/work-assignments/public-jobs';

/**
 * Fetches job details by its workAssignmentId from the Coople API.
 * @param workAssignmentId The UUID of the work assignment.
 * @returns A Promise that resolves to the ApiJobData.
 * @throws Error if the fetch fails or the API returns an error.
 */
export async function fetchJobDetailsById(workAssignmentId: string): Promise<ApiJobData> {
    const response = await fetch(`${API_BASE_URL}/${workAssignmentId}`);

    if (!response.ok) {
        let errorBody = '';
        try {
            errorBody = await response.text();
        } catch (e) {
            // Ignore if reading body fails
        }
        throw new Error(
            `Failed to fetch job details: ${response.status} ${response.statusText}. ${errorBody ? `Response: ${errorBody}` : ''}`,
        );
    }

    const result: JobDetailsApiResponse = await response.json();

    if (result.error || result.status !== 200) {
        throw new Error(
            `API error when fetching job details for ID ${workAssignmentId}: ${result.errorCode} - ${JSON.stringify(result.errorDetails)}`,
        );
    }

    return result.data;
} 