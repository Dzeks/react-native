export interface JobDetailsScreenProps {
    id: string | undefined;
    countryId: number;
}

export interface JobDetailsResponse {
    status: number;
    data: JobData;
    errorCode: string;
    errorDetails: Record<string, unknown>;
    errorId: number;
    error: boolean;
}

export interface JobData {
    workAssignmentId: string;
    waReadableId: string;
    hourlyWage: Wage;
    salary: Wage;
    jobSkill: JobSkill;
    workAssignmentName: string;
    jobLocation: JobLocation;
    periodFrom: number;
    datePublished: number;
    branchLink: string;
    requirements: string;
    clothingRequirements: string;
    periodTo: number;
    firstShiftTo: number;
    shiftsCount: number;
    workDuration: number;
    // Fields based on mockup - assuming they might come from API or need to be mocked
    companyName?: string;
    companyLogoUrl?: string;
    applicantsCount?: number;
    timeUntilCheckIn?: string;
    pdfInstructionUrl?: string;
    jobImages?: string[];
    scheduleInfo?: string;
    paymentDateInfo?: string;
    mealAllowance?: Wage;
    travelAllowance?: Wage;
    otherAllowances?: Wage;
    requiredExperience?: string;
    requiredSkills?: string[];
}

export interface Wage {
    amount: number;
    currencyId: number; // Assuming currencyId maps to a symbol like £
    description?: string; // Added for allowances
}

export interface JobSkill {
    jobProfileId: number;
    educationalLevelId: number;
}

export interface JobLocation {
    addressStreet: string;
    extraAddress: string;
    zip: string;
    city: string;
    state: string;
    countryId: number;
    distance?: string; // e.g., "12 miles"
}
