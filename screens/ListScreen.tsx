import React from 'react';
import { View, FlatList, Pressable } from 'react-native';
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

export default function ListScreen() {
  const insets = useSafeAreaInsets();

  const renderItem = ({ item }: { item: JobCardData }) => (
    <Card className="mx-4 mb-4 bg-white">
      <CardHeader className="pb-2">
        <View className="flex-row justify-between items-start">
          <View className="flex-row items-center flex-1">
            {/* Logo placeholder */}
            <View className="w-12 h-12 bg-gray-200 rounded-md mr-3 items-center justify-center">
              <Text className="text-xs text-gray-500">Logo</Text>
            </View>
            <View className="flex-1">
              <CardTitle className="text-lg font-semibold text-neutral-800 leading-tight">
                {item.title}
              </CardTitle>
            </View>
          </View>
          <View className="items-end ml-3">
            <Text className="text-base font-bold text-neutral-800">{item.payRate}</Text>
            <Text className="text-xs text-neutral-500">{item.publishedTime}</Text>
          </View>
        </View>
      </CardHeader>

      <CardContent className="pt-0 pb-2">
        <Text className="text-sm text-neutral-700 font-medium">{item.companyName}</Text>
        <Text className="text-xs text-neutral-600 mt-1">
          {item.location} · {item.distance}
        </Text>
        <Text className="text-xs text-neutral-600 mt-1">
          {item.date} · {item.shifts}
        </Text>
      </CardContent>

      <CardFooter className="flex-row justify-between items-center pt-0">
        <View className="flex-row flex-wrap gap-1 flex-1">
          {item.tags.map((tag) => (
            <Badge
              key={tag.text}
              className={`${
                tag.type === 'favourite' ? 'bg-pink-100' : 'bg-gray-200'
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  tag.type === 'favourite' ? 'text-pink-700' : 'text-neutral-700'
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
          <Bookmark size={24} className="text-neutral-600" />
        </Pressable>
      </CardFooter>
    </Card>
  );

  return (
    <View className="flex-1 bg-neutral-100" style={{ paddingTop: insets.top }}>
      {/* Header Section */}
      <View className="px-4 py-3 bg-white border-b border-neutral-200">
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <Text className="text-base text-neutral-700">London, EC2A 2BS (+60 km)</Text>
            <ChevronDown size={16} className="text-neutral-700 ml-1" />
          </View>
          <View className="flex-row items-center gap-3">
            <Search size={24} className="text-neutral-700" />
            <FilterIcon size={24} className="text-neutral-700" />
            <Bookmark size={24} className="text-neutral-700" />
          </View>
        </View>
        <View className="flex-row gap-2">
          <Badge className="bg-black rounded-full py-2 px-4">
            <View className="flex-row items-center">
              <Check size={16} className="text-white mr-1.5" />
              <Text className="text-white text-sm font-semibold">Flexible</Text>
            </View>
          </Badge>
          <Badge className="bg-neutral-200 rounded-full py-2 px-4">
            <Text className="text-neutral-700 text-sm font-semibold">Temp & perm</Text>
          </Badge>
        </View>
      </View>

      {/* Job List Title */}
      <View className="px-4 py-3 flex-row justify-between items-center">
        <Text className="text-lg font-bold text-neutral-800">202 Flexible jobs</Text>
        <View className="flex-row items-center">
          <ListFilter size={16} className="text-neutral-700 mr-1" />
          <Text className="text-sm text-neutral-700">Nearby</Text>
          <ChevronDown size={16} className="text-neutral-700 ml-0.5" />
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