import React from 'react';
import { View, Text, FlatList, Image, Pressable } from 'react-native';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import {
  ChevronDown,
  Search,
  SlidersHorizontal as FilterIcon, // Using SlidersHorizontal for Filter
  Bookmark,
  Check,
  ListFilter, // For sort icon
} from 'lucide-react-native';

// Interface for Job Card Data
interface JobCardData {
  id: string;
  logoUrl: string; // Placeholder for logo image
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
    logoUrl: 'deliveroo_logo_placeholder.png', // Replace with actual image path or URI
    title: 'Food and Beverage Associate - Palm Court - Photo ID Required',
    companyName: 'Deliveroo',
    location: 'London, EC2M 2PA',
    distance: '2.3 km',
    date: 'Wed, 20 Jul',
    shifts: '14 shifts',
    payRate: '£20.00 per hour',
    publishedTime: 'Published 2 hours ago',
    tags: [{ text: 'YOU ARE A FAVOURITE', type: 'favourite' }],
  },
  {
    id: '2',
    logoUrl: 'krispy_kreme_logo_placeholder.png', // Replace with actual image path or URI
    title: 'Waiter / Waitress',
    companyName: 'Krispy Kreme',
    location: 'London, NW86 7MX',
    distance: '1.7 km',
    date: 'Wed, 27 Jul',
    shifts: '4 shifts',
    payRate: '£25.00 per hour',
    publishedTime: 'Published 2 days ago',
    tags: [
      { text: 'WORKED BEFORE', type: 'workedBefore' },
      { text: 'HAS NIGHT SHIFTS', type: 'nightShift' },
    ],
  },
  // Add more job data items if needed
];

export default function ListScreen() {
  const renderItem = ({ item }: { item: JobCardData }) => (
    <Card className="m-4 bg-white rounded-lg shadow-md">
      <View className="p-3">
        <View className="flex-row justify-between items-start">
          <View className="flex-row items-center">
            {/* Placeholder for Logo */}
            <View className="w-12 h-12 bg-gray-200 rounded-md mr-3 items-center justify-center">
              <Text className="text-xs text-gray-500">Logo</Text>
            </View>
            <View className="flex-1">
              {/* Pay rate and published time are part of the header in Figma, but text alignment is different */}
            </View>
          </View>
          <View className="items-end">
            <Text className="text-base font-bold text-neutral-800">{item.payRate}</Text>
            <Text className="text-xs text-neutral-500">{item.publishedTime}</Text>
          </View>
        </View>

        <CardHeader className="pt-3 pb-1 px-0">
          <CardTitle className="text-lg font-semibold text-neutral-800">{item.title}</CardTitle>
        </CardHeader>

        <CardContent className="px-0 pb-1">
          <Text className="text-sm text-neutral-700">{item.companyName}</Text>
          <Text className="text-xs text-neutral-600 mt-1">
            {item.location} · {item.distance}
          </Text>
          <Text className="text-xs text-neutral-600 mt-1">
            {item.date} · {item.shifts}
          </Text>
        </CardContent>

        <CardFooter className="flex-row justify-between items-center pt-2 px-0 pb-0">
          <View className="flex-row flex-wrap gap-1">
            {item.tags.map((tag) => (
              <Badge
                key={tag.text}
                className={`
                  ${tag.type === 'favourite' ? 'bg-pink-100' : 'bg-gray-200'}
                `}
              >
                <Text
                  className={`
                    text-xs font-semibold
                    ${tag.type === 'favourite' ? 'text-pink-700' : 'text-neutral-700'}
                  `}
                >
                  {tag.text}
                </Text>
              </Badge>
            ))}
          </View>
          <Pressable onPress={() => console.log('Bookmark pressed for', item.id)}>
            <Bookmark size={24} className="text-neutral-600" />
          </Pressable>
        </CardFooter>
      </View>
    </Card>
  );

  return (
    <View className="flex-1 bg-neutral-100 pt-2">
      {/* Header Section from Screenshot */}
      <View className="px-4 py-3 bg-white border-b border-neutral-200">
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <Text className="text-base text-neutral-700">London, EC2A 2BS (+60 km)</Text>
            <ChevronDown size={16} className="text-neutral-700 ml-1" />
          </View>
          <View className="flex-row items-center space-x-3">
            <Search size={24} className="text-neutral-700" />
            <FilterIcon size={24} className="text-neutral-700" />
            <Bookmark size={24} className="text-neutral-700" />
          </View>
        </View>
        <View className="flex-row space-x-2">
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
        contentContainerClassName="pb-4"
      />
    </View>
  );
} 