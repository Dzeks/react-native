import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Pressable, Animated } from 'react-native';
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
import {
  ChevronDown,
  Search,
  SlidersHorizontal as FilterIcon,
  Bookmark,
  Check,
  ListFilter,
} from 'lucide-react-native';


// Interface for Job Card Data
interface JobCardData {
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

// Hardcoded Job Card Data based on the screenshot
const jobData: JobCardData[] = [
  {
    id: '1',
    logoUrl: 'deliveroo_logo_placeholder.png',
    title: 'Food and Beverage Associate - Palm Court - Photo ID Required',
    companyName: 'Deliveroo',
    location: 'London, EC2M 2PA',
    distance: '2.3 km',
    date: 'Wed, 20 Jul',
    shifts: '14 shifts',
    payRate: '£20.00',
    publishedTime: 'Published 2 hours ago',
    tags: [{ text: 'YOU ARE A FAVOURITE', type: 'favourite' }],
  },
  {
    id: '2',
    logoUrl: 'krispy_kreme_logo_placeholder.png',
    title: 'Waiter / Waitress',
    companyName: 'Krispy Kreme',
    location: 'London, NW86 7MX',
    distance: '1.7 km',
    date: 'Wed, 27 Jul',
    shifts: '4 shifts',
    payRate: '£25.00',
    publishedTime: 'Published 2 days ago',
    tags: [
      { text: 'WORKED BEFORE', type: 'workedBefore' },
      { text: 'HAS NIGHT SHIFTS', type: 'nightShift' },
    ],
  },
];

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

  // Initialize animations for each tab
  useEffect(() => {
    tabs.forEach((tab) => {
      if (!checkAnimations.current[tab.id]) {
        checkAnimations.current[tab.id] = new Animated.Value(tab.id === 'flexible' ? 1 : 0);
      }
    });
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

  const renderItem = ({ item }: { item: JobCardData }) => (
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
                {item.title}
              </CardTitle>
            </View>
          </View>
          <View className="items-end ml-3">
            <Text className="text-base font-bold text-card-foreground">{item.payRate}</Text>
            <Text className="text-xs text-muted-foreground">{item.publishedTime}</Text>
          </View>
        </View>
      </CardHeader>

      <CardContent className="pt-0 pb-2">
        <Text className="text-sm font-medium">{item.companyName}</Text>
        <Text className="text-xs text-muted-foreground mt-1">
          {item.location} · {item.distance}
        </Text>
        <Text className="text-xs text-muted-foreground mt-1">
          {item.date} · {item.shifts}
        </Text>
      </CardContent>

      <CardFooter className="flex-row justify-between items-center pt-0">
        <View className="flex-row flex-wrap gap-1 flex-1">
          {item.tags.map((tag) => (
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
          onPress={() => console.log('Bookmark pressed for', item.id)}
          className="ml-3"
        >
          <Bookmark size={24} className="text-muted-foreground" />
        </Pressable>
      </CardFooter>
    </Card>
  );

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
                     <Check size={16} className="text-secondary-foreground" />
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
        <Text className="text-lg font-bold text-foreground">202 Flexible jobs</Text>
        <View className="flex-row items-center">
          <ListFilter size={16} className="text-foreground mr-1" />
          <Text className="text-sm text-foreground">Nearby</Text>
          <ChevronDown size={16} className="text-foreground ml-0.5" />
        </View>
      </View>

      <FlatList
        data={jobData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerClassName="pt-2 pb-4"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
} 