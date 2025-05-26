import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Pressable, Animated, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Text } from '~/components/ui/text';
import { Bookmark } from '~/lib/icons/Bookmark';
import { Check } from '~/lib/icons/Check';
import { ChevronDown } from '~/lib/icons/ChevronDown';
import {
  Search,
  SlidersHorizontal as FilterIcon,
  ListFilter,
} from 'lucide-react-native';

// API Interfaces
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

// Interface for Job Card Data (will be mapped from PublicJob)
interface JobCardData {
  id: string;
  logoUrl: string; // This might need a placeholder or be removed if not in API
  title: string;
  companyName: string; // This might need a placeholder or be derived
  location: string;
  distance: string; // This might need to be calculated or removed
  date: string; // This will be derived from periodFrom
  shifts: string; // This information is not directly in PublicJob, might need placeholder or removal
  payRate: string; // This will be derived from hourlyWage or salary
  publishedTime: string; // This will be derived from datePublished
  tags: { text: string; type: 'favourite' | 'workedBefore' | 'nightShift' }[]; // This information is not in PublicJob, might need placeholder or removal
}

// Interface for Tab Data
interface TabData {
  id: string;
  label: string;
}

// Tab options
const tabs: TabData[] = [
  { id: 'internal', label: 'Internal' },
  { id: 'flexible', label: 'Flexible' },
  { id: 'temp-perm', label: 'Temp & perm' },
];

export default function ListScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<string>('flexible');
  const checkAnimations = useRef<{ [key: string]: Animated.Value }>({});
  const [jobs, setJobs] = useState<PublicJob[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalJobs, setTotalJobs] = useState<number>(0);

  // Initialize animations for each tab
  useEffect(() => {
    tabs.forEach((tab) => {
      if (!checkAnimations.current[tab.id]) {
        checkAnimations.current[tab.id] = new Animated.Value(tab.id === 'flexible' ? 1 : 0);
      }
    });
  }, []);

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      const pageSize = 20; // Or any other desired page size
      try {
        const response = await fetch(
          `https://www.coople.com/ch/resources/api/work-assignments/public-jobs/list?pageNum=0&pageSize=${pageSize}`,
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
          throw new Error(result.errorCode || 'API returned an error');
        }
        setJobs(result.data.items);
        setTotalJobs(result.data.total);
      } catch (e: any) {
        setError(e.message);
        console.error("Failed to fetch jobs:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Animate check icon when active tab changes
  useEffect(() => {
    tabs.forEach((tab) => {
      const targetValue = activeTab === tab.id ? 1 : 0;
      Animated.timing(checkAnimations.current[tab.id], {
        toValue: targetValue,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  }, [activeTab]);

  const formatPayRate = (job: PublicJob): string => {
    if (job.hourlyWage && job.hourlyWage.amount) {
      return `£${job.hourlyWage.amount.toFixed(2)}/hr`;
    }
    if (job.salary && job.salary.amount) {
      // Assuming salary is per year, adjust if it's per month or other period
      return `£${job.salary.amount.toFixed(2)}`;
    }
    return 'N/A';
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    });
  };

  const formatPublishedTime = (timestamp: number): string => {
    const now = new Date();
    const publishedDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - publishedDate.getTime()) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 1) return `Published ${days} days ago`;
    if (days === 1) return `Published 1 day ago`;
    if (hours > 1) return `Published ${hours} hours ago`;
    if (hours === 1) return `Published 1 hour ago`;
    if (minutes > 1) return `Published ${minutes} minutes ago`;
    if (minutes === 1) return `Published 1 minute ago`;
    return 'Published just now';
  };

  const mapPublicJobToJobCardData = (publicJob: PublicJob): JobCardData => {
    return {
      id: publicJob.workAssignmentId,
      logoUrl: 'logo_placeholder.png', // Placeholder
      title: publicJob.workAssignmentName,
      companyName: publicJob.branchLink || 'N/A', // Use branchLink or N/A
      location: `${publicJob.jobLocation.city}, ${publicJob.jobLocation.zip}`,
      distance: 'N/A', // Placeholder
      date: formatDate(publicJob.periodFrom),
      shifts: 'N/A', // Placeholder - not directly available
      payRate: formatPayRate(publicJob),
      publishedTime: formatPublishedTime(publicJob.datePublished),
      tags: [], // Placeholder - not available in API
    };
  };

  const renderItem = ({ item }: { item: PublicJob }) => {
    const jobCardItem = mapPublicJobToJobCardData(item);
    return (
      <Card className="mx-4 mb-4">
        <CardHeader className="pb-2">
          <View className="flex-row justify-between items-start">
            <View className="flex-row items-center flex-1">
              {/* Logo placeholder */}
              <View className="w-12 h-12 bg-muted rounded-md mr-3 items-center justify-center">
                <Text className="text-xs text-muted-foreground">Logo</Text>
              </View>
              <View className="flex-1">
                <CardTitle className="text-lg font-semibold leading-tight">
                  {jobCardItem.title}
                </CardTitle>
              </View>
            </View>
            <View className="items-end ml-3">
              <Text className="text-base font-bold text-card-foreground">{jobCardItem.payRate}</Text>
              <Text className="text-xs text-muted-foreground">{jobCardItem.publishedTime}</Text>
            </View>
          </View>
        </CardHeader>

        <CardContent className="pt-0 pb-2">
          <Text className="text-sm font-medium">{jobCardItem.companyName}</Text>
          <Text className="text-xs text-muted-foreground mt-1">
            {jobCardItem.location} · {jobCardItem.distance}
          </Text>
          <Text className="text-xs text-muted-foreground mt-1">
            {jobCardItem.date} · {jobCardItem.shifts}
          </Text>
        </CardContent>

        <CardFooter className="flex-row justify-between items-center pt-0">
          <View className="flex-row flex-wrap gap-1 flex-1">
            {jobCardItem.tags.map((tag) => (
              <Badge
                key={tag.text}
                className={`${
                  tag.type === 'favourite' ? 'bg-pink-100 dark:bg-pink-900' : 'bg-gray-200 dark:bg-neutral-700'
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    tag.type === 'favourite' ? 'text-pink-700 dark:text-pink-300' : 'text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {tag.text}
                </Text>
              </Badge>
            ))}
          </View>
          <Pressable
            onPress={() => console.log('Bookmark pressed for', jobCardItem.id)}
            className="ml-3"
          >
            <Bookmark size={24} className="text-foreground" />
          </Pressable>
        </CardFooter>
      </Card>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background" style={{ paddingTop: insets.top }}>
        <ActivityIndicator size="large" />
        <Text className="mt-2 text-muted-foreground">Loading jobs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-background" style={{ paddingTop: insets.top }}>
        <Text className="text-destructive text-center mb-4">Error: {error}</Text>
        <Pressable onPress={() => { /* Implement retry logic if needed */ }} className="bg-primary py-2 px-4 rounded-md">
          <Text className="text-primary-foreground">Try Again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header Section */}
      <View className="px-4 py-3 bg-card border-b border-border">
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <Text className="text-base text-foreground">London, EC2A 2BS (+60 km)</Text>
            <ChevronDown size={16} className="text-foreground ml-1" />
          </View>
          <View className="flex-row items-center gap-3">
            <Search size={24} className="text-foreground" />
            <FilterIcon size={24} className="text-foreground" />
            <Bookmark size={24} className="text-foreground" />
          </View>
        </View>
        <View className="flex-row gap-2">
          {tabs.map((tab) => (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              className={`rounded-full py-2 px-2 border-2 ${
                activeTab === tab.id 
                  ? 'border-black' 
                  : 'border-primary-foreground'
              }`}
            >
               <View className="flex-row items-center justify-center">
                 <View className="w-4 mr-1.5">
                   <Animated.View
                     style={{
                       opacity: checkAnimations.current[tab.id],
                       transform: [
                         {
                           scale: checkAnimations.current[tab.id]?.interpolate({
                             inputRange: [0, 1],
                             outputRange: [0.5, 1],
                           }) || 0.5,
                         },
                       ],
                     }}
                   >
                     <Check size={16} className="text-foreground" />
                   </Animated.View>
                 </View>
                 <Text 
                   className="text-sm font-semibold text-secondary-foreground mr-4"
                 >
                   {tab.label}
                 </Text>
               </View>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Job List Title */}
      <View className="px-4 py-3 flex-row justify-between items-center">
        <Text className="text-lg font-bold text-foreground">{totalJobs} {activeTab} jobs</Text>
        <View className="flex-row items-center">
          <ListFilter size={16} className="text-foreground mr-1" />
          <Text className="text-sm text-foreground">Nearby</Text>
          <ChevronDown size={16} className="text-foreground ml-0.5" />
        </View>
      </View>

      <FlatList
        data={jobs}
        renderItem={renderItem}
        keyExtractor={(item) => item.workAssignmentId}
        contentContainerClassName="pt-2 pb-4"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
} 