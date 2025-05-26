import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, HelpCircle, Share2, Bookmark, Clock, FileText, MapPin } from 'lucide-react-native'; // Assuming lucide-react-native for icons

interface JobDetailsScreenProps {
  id: string | undefined;
  countryId: number;
}

interface JobDetailsResponse {
  status: number;
  data: JobData;
  errorCode: string;
  errorDetails: Record<string, unknown>;
  errorId: number;
  error: boolean;
}

interface JobData {
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

interface Wage {
  amount: number;
  currencyId: number; // Assuming currencyId maps to a symbol like £
  description?: string; // Added for allowances
}

interface JobSkill {
  jobProfileId: number;
  educationalLevelId: number;
}

interface JobLocation {
  addressStreet: string;
  extraAddress: string;
  zip: string;
  city: string;
  state: string;
  countryId: number;
  distance?: string; // e.g., "12 miles"
}

const mockJobData: JobData = { // Mock data for UI development based on the screenshot
  workAssignmentId: '12345',
  waReadableId: 'JOB-001',
  hourlyWage: { amount: 21.50, currencyId: 1, description: '£520.00' }, // Assuming currencyId 1 is GBP
  salary: { amount: 0, currencyId: 1 }, // Not explicitly shown for salary in pay section
  jobSkill: { jobProfileId: 1, educationalLevelId: 2 },
  workAssignmentName: 'Full and Part time Waiter / waitress - via Emilia Shoreditch & Fitzrovia',
  jobLocation: {
    addressStreet: 'London, SW1Y 4AH',
    extraAddress: '',
    zip: 'SW1Y 4AH',
    city: 'London',
    state: '',
    countryId: 1,
    distance: '12 miles'
  },
  periodFrom: new Date().getTime(),
  datePublished: new Date().setDate(new Date().getDate() -1), // Posted 4 hr ago
  branchLink: '',
  requirements: 'Detailed requirements about the job. This section will contain a longer text describing what is expected from the candidate.',
  clothingRequirements: 'Specific clothing instructions if any.',
  periodTo: new Date().getTime() + (1000 * 60 * 60 * 24 * 30),
  firstShiftTo: new Date().getTime() + (1000 * 60 * 60 * 24 * 2),
  shiftsCount: 10, // 10/12 shifts available
  workDuration: 8,
  companyName: 'Teleperformance',
  companyLogoUrl: 'https://via.placeholder.com/40?text=T', // Placeholder logo
  applicantsCount: 21,
  timeUntilCheckIn: '12:30 until check-in',
  pdfInstructionUrl: '#',
  jobImages: [
    'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=Image1',
    'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=Image2',
    'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=Image3',
    'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=Image4',
  ],
  scheduleInfo: '12 Jul - 23 Aug ⋅ 10/12 shifts available',
  paymentDateInfo: '15th of each month',
  mealAllowance: { amount: 12.00, currencyId: 1, description: 'per shift' },
  travelAllowance: { amount: 8.00, currencyId: 1, description: 'for the whole job' },
  otherAllowances: { amount: 20.00, currencyId: 1, description: 'per hour' },
  requiredExperience: '12 months of Care Associate or similar experience',
  requiredSkills: ['Advanced English'],
};


export default function JobDetailsScreenComponent({ id: routeId }: JobDetailsScreenProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [jobDetails, setJobDetails] = useState<JobData | null>(mockJobData); // Using mock data
  const [loading, setLoading] = useState(false); // Adjusted for mock data
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('About');

  // TODO: Remove this useEffect or adapt if switching back to API fetching
  useEffect(() => {
    if (routeId) {
      // Simulate API call or fetch actual data if needed
      // For now, we are using mockJobData directly
      // const fetchJobDetails = async () => { ... };
      // fetchJobDetails();
      setJobDetails(prevDetails => ({
        ...prevDetails,
        ...mockJobData, // Ensure mock data is spread if any part of it is dynamic
        workAssignmentName: prevDetails?.workAssignmentName || mockJobData.workAssignmentName,
      }));
      setLoading(false);
    } else {
      // setLoading(false); // Handled by initial state
      // setError("No job ID provided."); // Or handle differently
    }
  }, [routeId]);

  const renderCurrencySymbol = (currencyId: number) => {
    // Basic mapping, expand as needed
    if (currencyId === 1) return '£';
    return '$'; // Default
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background" style={{ paddingTop: insets.top }}>
        <Stack.Screen options={{ title: 'Loading Job...' }} />
        <ActivityIndicator size="large" className="mb-2" />
        <Text className="text-muted-foreground">Loading job details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-background px-4" style={{ paddingTop: insets.top }}>
        <Stack.Screen options={{ title: 'Error' }} />
        <Text className="text-red-500 text-center">Error: {error}</Text>
      </View>
    );
  }

  if (!jobDetails) {
    return (
      <View className="flex-1 justify-center items-center bg-background px-4" style={{ paddingTop: insets.top }}>
        <Stack.Screen options={{ title: 'Job Not Found' }} />
        <Text className="text-muted-foreground">Job details not found or no ID provided.</Text>
      </View>
    );
  }
  
  const tabs = ['About', 'Requirements', 'Location', 'Process'];
  const scheduleDays = [
    { day: 'Mon', date: '23 Jul', time: '09:00 - 22:00' },
    { day: 'Tue', date: '24 Jul', time: '09:00 - 22:00' },
    { day: 'Wed', date: '25 Jul', time: '09:00 - 22:00' },
    { day: 'Thu', date: '26 Jul', time: '09:00 - 22:00' },
    { day: 'Fri', date: '27 Jul', time: '09:00 - 22:00' },
  ];

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: Platform.OS === 'android' ? insets.top : 0 }}>
      <Stack.Screen
        options={{
          headerTransparent: true,
          title: '',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="p-2 ml-2 bg-card/70 dark:bg-card/70 rounded-full">
              <ChevronLeft size={24} className="text-foreground" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View className="flex-row items-center mr-2">
              <TouchableOpacity className="p-2 bg-card/70 dark:bg-card/70 rounded-full ml-2">
                <HelpCircle size={24} className="text-foreground" />
              </TouchableOpacity>
              <TouchableOpacity className="p-2 bg-card/70 dark:bg-card/70 rounded-full ml-2">
                <Share2 size={24} className="text-foreground" />
              </TouchableOpacity>
              <TouchableOpacity className="p-2 bg-card/70 dark:bg-card/70 rounded-full ml-2">
                <Bookmark size={24} className="text-foreground" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <ScrollView contentContainerClassName="pb-24" className="flex-1">
        <View className="bg-card pt-20 px-4 pb-4"> {/* Added pt-20 for header spacing */}
          <View className="flex-row items-center mb-1">
            {jobDetails.companyLogoUrl && (
              <Image source={{ uri: jobDetails.companyLogoUrl }} className="w-6 h-6 rounded-full mr-2" />
            )}
            <Text className="text-sm text-purple-600 font-semibold">{jobDetails.companyName || 'Teleperformance'}</Text>
          </View>
          <Text className="text-2xl font-bold text-foreground mb-1.5">{jobDetails.workAssignmentName}</Text>
          <View className="flex-row items-center mb-3">
            <Text className="text-sm text-muted-foreground underline">
              {jobDetails.jobLocation.addressStreet} ({jobDetails.jobLocation.distance})
            </Text>
            <View className="bg-muted px-1.5 py-0.5 rounded ml-2">
              <Text className="text-xs text-muted-foreground">+2</Text>
            </View>
          </View>
          <Text className="text-xs text-muted-foreground mb-4">
            Posted {Math.round((new Date().getTime() - jobDetails.datePublished) / (1000 * 60 * 60))} hr ago ⋅ {jobDetails.applicantsCount} applicant
            {jobDetails.applicantsCount !== 1 ? 's' : ''}
          </Text>

          <View className="flex-row items-center bg-yellow-100 dark:bg-yellow-700/30 p-3 rounded-lg mb-4 border border-yellow-300 dark:border-yellow-600">
            <Clock size={20} color="orange" className="mr-2" />
            <Text className="text-sm text-yellow-700 dark:text-yellow-300">
              {jobDetails.timeUntilCheckIn}. Please, read <Text className="font-bold text-red-600 dark:text-red-400">PDF instruction</Text> before shift started
            </Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-4 py-3 bg-card">
          {(jobDetails.jobImages || []).map((img, index) => (
            <Image key={index} source={{ uri: img }} className="w-32 h-32 rounded-md mr-2" />
          ))}
        </ScrollView>

        <View className="flex-row bg-card border-b border-border px-1 mt-1">
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`py-3 px-4 mx-1 items-center justify-center border-b-2 ${activeTab === tab ? 'border-purple-600' : 'border-transparent'}`}
            >
              <Text className={`text-sm font-medium ${activeTab === tab ? 'text-purple-600' : 'text-muted-foreground'}`}>
                {tab}
              </Text>
               {tab === "About" && activeTab === tab && <View className="absolute bottom-[-1px] left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-purple-600 rounded-full" />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Content based on activeTab */}
        {activeTab === 'About' && (
          <View className="p-4 bg-card">
            <View className="mb-6">
              <Text className="text-xl font-bold text-foreground mb-2">Schedule</Text>
              <Text className="text-sm text-muted-foreground mb-3">{jobDetails.scheduleInfo}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="space-x-2">
                {scheduleDays.map(item => (
                  <View key={item.date} className="border border-border rounded-lg p-3 w-28 items-center bg-muted">
                    <Text className="text-xs text-muted-foreground font-medium">{item.day}</Text>
                    <Text className="text-lg font-bold text-foreground my-0.5">{item.date}</Text>
                    <Text className="text-xs text-muted-foreground">{item.time}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            <View className="mb-6">
              <Text className="text-xl font-bold text-foreground mb-2">Pay</Text>
              <Text className="text-sm text-muted-foreground mb-3">Payment date – {jobDetails.paymentDateInfo}</Text>
              
              <View className="flex-row justify-between items-start py-3 border-b border-border">
                <View>
                  <Text className="text-base text-foreground font-medium">Rate incl. holiday pay</Text>
                  <Text className="text-sm text-muted-foreground">Description</Text>
                </View>
                <View className="items-end">
                  <Text className="text-base text-foreground font-semibold">
                    {renderCurrencySymbol(jobDetails.hourlyWage.currencyId)}{jobDetails.hourlyWage.amount.toFixed(2)} per hour
                  </Text>
                  {jobDetails.hourlyWage.description && 
                    <Text className="text-sm text-muted-foreground">{jobDetails.hourlyWage.description}</Text>
                  }
                </View>
              </View>

              {jobDetails.mealAllowance && (
                <View className="flex-row justify-between items-start py-3 border-b border-border">
                  <View>
                    <Text className="text-base text-foreground font-medium">Meal allowances</Text>
                    <Text className="text-sm text-muted-foreground">Description</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-base text-foreground font-semibold">
                      - {renderCurrencySymbol(jobDetails.mealAllowance.currencyId)}{jobDetails.mealAllowance.amount.toFixed(2)}
                    </Text>
                    <Text className="text-sm text-muted-foreground">{jobDetails.mealAllowance.description}</Text>
                  </View>
                </View>
              )}

              {jobDetails.travelAllowance && (
                <View className="flex-row justify-between items-start py-3 border-b border-border">
                  <View>
                    <Text className="text-base text-foreground font-medium">Travel allowances</Text>
                    <Text className="text-sm text-muted-foreground">Description</Text>
                  </View>
                   <View className="items-end">
                    <Text className="text-base text-foreground font-semibold">
                      + {renderCurrencySymbol(jobDetails.travelAllowance.currencyId)}{jobDetails.travelAllowance.amount.toFixed(2)}
                    </Text>
                    <Text className="text-sm text-muted-foreground">{jobDetails.travelAllowance.description}</Text>
                  </View>
                </View>
              )}
              
              {jobDetails.otherAllowances && (
                <View className="flex-row justify-between items-start py-3">
                  <View>
                    <Text className="text-base text-foreground font-medium">Other allowances</Text>
                    <Text className="text-sm text-muted-foreground">Description</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-base text-foreground font-semibold">
                      + {renderCurrencySymbol(jobDetails.otherAllowances.currencyId)}{jobDetails.otherAllowances.amount.toFixed(2)}
                    </Text>
                    <Text className="text-sm text-muted-foreground">{jobDetails.otherAllowances.description}</Text>
                  </View>
                </View>
              )}
            </View>

            <View className="mb-6">
              <Text className="text-xl font-bold text-foreground mb-2">Attached instruction</Text>
              <Text className="text-sm text-muted-foreground mb-3">Read the instructions in advance</Text>
              <TouchableOpacity className="flex-row items-center justify-between p-3 border border-border rounded-lg bg-muted">
                <View className="flex-row items-center">
                  <FileText size={24} color="purple" className="mr-3" />
                  <Text className="text-base text-foreground font-medium">PDF instruction</Text>
                </View>
                <ChevronLeft size={20} className="text-muted-foreground" style={{ transform: [{ rotate: '180deg' }]}} />
              </TouchableOpacity>
            </View>

            <View className="mb-6">
              <Text className="text-xl font-bold text-foreground mb-2">Required experience</Text>
              <Text className="text-base text-foreground">{jobDetails.requiredExperience}</Text>
            </View>

            <View>
              <Text className="text-xl font-bold text-foreground mb-2">Required skills</Text>
              {(jobDetails.requiredSkills || []).map((skill, index) => (
                <Text key={index} className="text-base text-foreground mb-1">- {skill}</Text>
              ))}
              {/* Mockup shows "Advanced English" but it's cut off, assuming it's a list */}
            </View>
          </View>
        )}
         {activeTab === 'Requirements' && (
          <View className="p-4 bg-card min-h-[200px]">
            <Text className="text-lg font-bold text-foreground mb-1.5">Requirements:</Text>
            <Text className="text-base text-foreground mb-2">{jobDetails.requirements}</Text>
            {jobDetails.clothingRequirements && (
              <>
                <Text className="text-lg font-bold text-foreground mt-3 mb-1.5">Clothing Requirements:</Text>
                <Text className="text-base text-foreground mb-2">{jobDetails.clothingRequirements}</Text>
              </>
            )}
          </View>
        )}
        {activeTab === 'Location' && (
          <View className="p-4 bg-card min-h-[200px]">
            <Text className="text-lg font-bold text-foreground mb-1.5">Location:</Text>
            <Text className="text-base text-foreground">
              {jobDetails.jobLocation.addressStreet}, {jobDetails.jobLocation.extraAddress ? jobDetails.jobLocation.extraAddress + ', ' : ''} 
              {jobDetails.jobLocation.zip} {jobDetails.jobLocation.city}
            </Text>
            {/* Placeholder for map view if needed */}
            <View className="h-48 bg-muted my-4 rounded-lg items-center justify-center">
                <MapPin size={48} className="text-muted-foreground" />
                <Text className="text-muted-foreground mt-2">Map Placeholder</Text>
            </View>
          </View>
        )}
        {activeTab === 'Process' && (
           <View className="p-4 bg-card min-h-[200px]">
            <Text className="text-lg font-bold text-foreground">Application Process</Text>
            <Text className="text-base text-muted-foreground mt-2">Details about the application process would go here.</Text>
          </View>
        )}

      </ScrollView>
      <View 
        className="absolute bottom-0 left-0 right-0 flex-row justify-between p-4 border-t border-border bg-card" 
        style={{ paddingBottom: insets.bottom + 16, paddingTop: 16 }} // Adjust padding for safe area and desired top padding
        >
        <TouchableOpacity className="flex-1 bg-card border border-border rounded-lg py-3.5 mr-2 items-center justify-center">
          <Text className="text-foreground text-base font-semibold">Directions</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-rose-500 rounded-lg py-3.5 ml-2 items-center justify-center">
          <Text className="text-white text-base font-semibold">Report hours</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 