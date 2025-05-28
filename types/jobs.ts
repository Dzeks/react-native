export interface PublicJob {
    workAssignmentId: string;
    waReadableId: string;
    hourlyWage: {
        amount: number;
        currencyId: number;
    };
    salary: {
        amount: number;
        currencyId: number;
    };
    hourlyWageWithHolidayPay?: {
        amount: number;
        currencyId: number;
    };
    salaryWithHolidayPay?: {
        amount: number;
        currencyId: number;
    };
    jobSkill: {
        jobProfileId: number;
        educationalLevelId: number;
    };
    workAssignmentName: string;
    jobLocation: {
        addressStreet: string;
        extraAddress: string;
        zip: string;
        city: string;
        state: string;
        countryId: number;
    };
    periodFrom: number;
    datePublished: number;
    branchLink?: string;
}

export interface CoopleJobsResponse {
    status: number;
    data: {
        items: PublicJob[];
        total: number;
    };
    errorCode: string;
    errorDetails: Record<string, any>;
    errorId: number;
    error: boolean;
}

export interface CoopleJobsRequest {
    pageNum: number;
    pageSize: number;
}

export interface JobCardData {
    id: string;
    logoUrl: string;
    title: string;
    companyName: string;
    location: string;
    distance: string;
    date: string;
    shifts: string;
    payRate: string;
    publishedTime: string;
    tags: { text: string; type: 'favourite' | 'workedBefore' | 'nightShift' }[];
}
