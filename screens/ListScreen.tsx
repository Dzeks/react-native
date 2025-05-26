import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, FlatList, Pressable as RNPressable, Animated, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
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
import { Skeleton } from '~/components/ui/skeleton';
import { Bookmark } from '~/lib/icons/Bookmark';
import { Check } from '~/lib/icons/Check';
import { ChevronDown } from '~/lib/icons/ChevronDown';
import {
  Search,
  SlidersHorizontal as FilterIcon,
  ListFilter,
} from 'lucide-react-native';
import { PublicJob, JobCardData } from '~/types/jobs'; // Import interfaces
import { fetchPublicJobs } from '~/services/jobService'; // Import service

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

const PAGE_SIZE = 20;

export default function ListScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<string>('flexible');
  const checkAnimations = useRef<{ [key: string]: Animated.Value }>({});
  const [jobs, setJobs] = useState<PublicJob[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [canLoadMore, setCanLoadMore] = useState<boolean>(true);

  const router = useRouter();

  // Initialize animations for each tab
  useEffect(() => {
    tabs.forEach((tab) => {
      if (!checkAnimations.current[tab.id]) {
        checkAnimations.current[tab.id] = new Animated.Value(tab.id === 'flexible' ? 1 : 0);
      }
    });
  }, []);

  const loadPageData = useCallback(async (page: number, isRefreshOperation: boolean = false) => {
    if (isRefreshOperation) {
      setLoading(true);
    } else if (page === 0) {
      setLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);

    try {
      const data = await fetchPublicJobs({ pageNum: page, pageSize: PAGE_SIZE });
      const newItems = data.items;

      setJobs(prevJobs => {
        const updatedJobs = (isRefreshOperation || page === 0) ? newItems : [...prevJobs, ...newItems];
        setCanLoadMore(newItems.length === PAGE_SIZE && updatedJobs.length < data.total);
        return updatedJobs;
      });
      setTotalJobs(data.total);

      if (isRefreshOperation) {
        setCurrentPage(0);
      } else {
        setCurrentPage(page);
      }

    } catch (e: any) {
      setError(e.message);
      console.error("Failed to fetch jobs:", e);
      setCanLoadMore(false);
    } finally {
      if (isRefreshOperation || page === 0) {
        setLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    loadPageData(0);
  }, [loadPageData]);

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

  const onRefresh = useCallback(() => {
    setCanLoadMore(true);
    loadPageData(0, true);
  }, [loadPageData]);

  const handleLoadMore = useCallback(() => {
    if (!loading && !isLoadingMore && canLoadMore) {
      loadPageData(currentPage + 1);
    }
  }, [loading, isLoadingMore, canLoadMore, currentPage, loadPageData]);

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

    const handlePress = () => {
      router.push(`/job/${jobCardItem.id}` as any);
    };

    return (
      <RNPressable onPress={handlePress}>
        <Card className="mx-4 mb-4">
          <CardHeader className="pb-2">
            <View className="flex-row justify-between items-start">
              <View className="flex-row items-center">
                {/* Logo placeholder */}
                <View className="w-12 h-12 bg-muted rounded-md mr-3 items-center justify-center">
                  <Text className="text-xs text-muted-foreground">Logo</Text>
                </View>
              </View>
              <View className="items-end ml-3">
                <Text className="text-base font-bold text-card-foreground">{jobCardItem.payRate}</Text>
                <Text className="text-xs text-muted-foreground">{jobCardItem.publishedTime}</Text>
              </View>
            </View>
            <View className="mt-2">
              <CardTitle className="text-lg font-semibold leading-tight" numberOfLines={3}>
                {jobCardItem.title}
              </CardTitle>
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
            <RNPressable
              onPress={() => console.log('Bookmark pressed for', jobCardItem.id)}
              className="ml-3"
            >
              <Bookmark size={24} className="text-foreground" />
            </RNPressable>
          </CardFooter>
        </Card>
      </RNPressable>
    );
  };

  const renderSkeletonItem = () => (
    <Card className="mx-4 mb-4">
      <CardHeader className="pb-2">
        <View className="flex-row justify-between items-start">
          <View className="flex-row items-center flex-1">
            <Skeleton className="w-12 h-12 rounded-md mr-3" />
            <View className="flex-1">
              <Skeleton className="h-5 w-3/4 rounded" />
            </View>
          </View>
          <View className="items-end ml-3">
            <Skeleton className="h-5 w-16 rounded mt-1" />
            <Skeleton className="h-3 w-24 rounded mt-1.5" />
          </View>
        </View>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <Skeleton className="h-4 w-1/2 rounded mt-1.5" />
        <Skeleton className="h-3 w-3/4 rounded mt-1.5" />
        <Skeleton className="h-3 w-2/3 rounded mt-1.5" />
      </CardContent>
      <CardFooter className="flex-row justify-between items-center pt-0">
        <View className="flex-row flex-wrap gap-1 flex-1">
          <Skeleton className="h-5 w-16 rounded" />
          <Skeleton className="h-5 w-20 rounded" />
        </View>
        <Skeleton className="w-6 h-6 rounded-full ml-3" />
      </CardFooter>
    </Card>
  );

  const renderListHeader = () => (
    <View className="px-4 py-3 flex-row justify-between items-center">
      <Text className="text-lg font-bold text-foreground">{totalJobs} {activeTab} jobs</Text>
      <View className="flex-row items-center">
        <ListFilter size={16} className="text-foreground mr-1" />
        <Text className="text-sm text-foreground">Nearby</Text>
        <ChevronDown size={16} className="text-foreground ml-0.5" />
      </View>
    </View>
  );

  if (loading && jobs.length === 0) {
    return (
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        {/* Header Section - Rendered to maintain layout consistency */}
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
              <RNPressable
                key={tab.id}
                className={`rounded-full py-2 px-2 border-2 ${
                  activeTab === tab.id 
                    ? 'border-black' 
                    : 'border-primary-foreground' // Consider a disabled style
                }`}
              >
                 <View className="flex-row items-center justify-center">
                   <View className="w-4 mr-1.5">
                       <Check size={16} className="text-foreground opacity-50" /> 
                   </View>
                   <Text 
                     className="text-sm font-semibold text-secondary-foreground mr-4 opacity-50"
                   >
                     {tab.label}
                   </Text>
                 </View>
              </RNPressable>
            ))}
          </View>
        </View>

        {/* Job List Title Skeleton */}
        <View className="px-4 py-3 flex-row justify-between items-center">
          <Skeleton className="h-6 w-1/3 rounded" />
          <View className="flex-row items-center">
            <Skeleton className="h-5 w-20 rounded" />
          </View>
        </View>
        
        {/* Skeleton List */}
        <FlatList
          data={Array.from({ length: 5 })} // Render 5 skeleton items
          renderItem={renderSkeletonItem}
          keyExtractor={(_, index) => `skeleton-${index}`}
          contentContainerClassName="pt-2 pb-4"
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

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
        <RNPressable onPress={() => { /* Implement retry logic if needed */ }} className="bg-primary py-2 px-4 rounded-md">
          <Text className="text-primary-foreground">Try Again</Text>
        </RNPressable>
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
            <RNPressable
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
            </RNPressable>
          ))}
        </View>
      </View>

      <FlatList
        data={jobs}
        renderItem={renderItem}
        keyExtractor={(item) => item.workAssignmentId}
        ListHeaderComponent={renderListHeader}
        contentContainerClassName="pb-4" // Removed pt-2 as header now provides top padding
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading && currentPage === 0 && jobs.length > 0} onRefresh={onRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoadingMore && canLoadMore ? (
            <View className="py-4 items-center">
              <ActivityIndicator size="small" />
            </View>
          ) : null
        }
      />
    </View>
  );
} 