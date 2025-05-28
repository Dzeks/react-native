import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    Image,
    Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Share2, Clock, FileText, MapPin } from 'lucide-react-native';
import { Bookmark } from '~/lib/icons/Bookmark';
import { Info } from '~/lib/icons/Info';
import { ChevronLeft } from '~/lib/icons/ChevronLeft';
import { JobDetailsScreenProps } from '../types/job-details';
import { ApiJobData, fetchJobDetailsById } from '../service/job-details-service';

export default function JobDetailsScreenComponent({
    id: routeId,
}: JobDetailsScreenProps) {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [jobDetails, setJobDetails] = useState<ApiJobData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('About');

    useEffect(() => {
        if (routeId) {
            const loadJobDetails = async () => {
                setLoading(true);
                setError(null);
                try {
                    const data = await fetchJobDetailsById(routeId);
                    setJobDetails(data);
                } catch (e: any) {
                    setError(e.message || 'Failed to load job details.');
                    console.error("Failed to fetch job details:", e);
                } finally {
                    setLoading(false);
                }
            };
            loadJobDetails();
        } else {
            setError("No job ID provided.");
            setLoading(false);
        }
    }, [routeId]);

    const renderCurrencySymbol = (currencyId: number) => {
        if (currencyId === 1) return 'CHF';
        return '$';
    };

    if (loading) {
        return (
            <View
                className="flex-1 justify-center items-center bg-background"
                style={{ paddingTop: insets.top }}>
                <Stack.Screen options={{ title: 'Loading Job...' }} />
                <ActivityIndicator size="large" className="mb-2" />
                <Text className="text-muted-foreground">
                    Loading job details...
                </Text>
            </View>
        );
    }

    if (error) {
        return (
            <View
                className="flex-1 justify-center items-center bg-background px-4"
                style={{ paddingTop: insets.top }}>
                <Stack.Screen options={{ title: 'Error' }} />
                <Text className="text-red-500 text-center">Error: {error}</Text>
            </View>
        );
    }

    if (!jobDetails) {
        return (
            <View
                className="flex-1 justify-center items-center bg-background px-4"
                style={{ paddingTop: insets.top }}>
                <Stack.Screen options={{ title: 'Job Not Found' }} />
                <Text className="text-muted-foreground">
                    {error ? 'Error loading job.' : 'Job details not found or no ID provided.'}
                </Text>
            </View>
        );
    }

    const tabs = ['About', 'Requirements', 'Location', 'Process'];

    // Placeholder data for fields not available in ApiJobData
    const companyName = "Coople Switzerland AG"; // Example placeholder
    const companyLogoUrl = 'https://via.placeholder.com/40?text=C'; // Placeholder logo
    const applicantsCountDisplay = "N/A"; // API does not provide this
    const timeUntilCheckInDisplay = "Check instructions"; // API does not provide this
    const jobImagesToDisplay: string[] = []; // API does not provide job images
    const scheduleInfoDisplay = `From: ${new Date(jobDetails.periodFrom).toLocaleDateString()} To: ${new Date(jobDetails.periodTo).toLocaleDateString()}, Shifts: ${jobDetails.shiftsCount}`;
    const paymentDateInfoDisplay = "See contract details"; // API does not provide this
    const requiredExperienceDisplay = "See job requirements.";
    const requiredSkillsDisplay = "See job requirements.";

    return (
        <View
            className="flex-1 bg-background"
            style={{ paddingTop: insets.top, flex: 1 }}>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <View className="flex-row justify-between items-center px-4 py-2">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="p-2 bg-card/70 dark:bg-card/70 rounded-full">
                    <ChevronLeft size={24} className="text-foreground" />
                </TouchableOpacity>
                <View className="flex-row items-center">
                    <TouchableOpacity className="p-2 bg-card/70 dark:bg-card/70 rounded-full ml-2">
                        <Info size={24} className="text-foreground" />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 bg-card/70 dark:bg-card/70 rounded-full ml-2">
                        <Share2 size={24} className="text-foreground" />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 bg-card/70 dark:bg-card/70 rounded-full ml-2">
                        <Bookmark size={24} className="text-foreground" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerClassName="pb-24" className="flex-1">
                <View className="bg-card px-4 pb-4">
                    <View className="flex-row items-center mb-1">
                        {companyLogoUrl && (
                            <Image
                                source={{ uri: companyLogoUrl }}
                                className="w-6 h-6 rounded-full mr-2"
                            />
                        )}
                        <Text className="text-sm text-purple-600 font-semibold">
                            {companyName} {/* Using placeholder */}
                        </Text>
                    </View>
                    <Text className="text-2xl font-bold text-foreground mb-1.5">
                        {jobDetails.workAssignmentName}
                    </Text>
                    <View className="flex-row items-center mb-3">
                        <Text className="text-sm text-muted-foreground underline">
                            {jobDetails.jobLocation.city}, {jobDetails.jobLocation.zip}
                        </Text>
                    </View>
                    <Text className="text-xs text-muted-foreground mb-4">
                        Posted{' '}
                        {Math.round(
                            (new Date().getTime() - jobDetails.datePublished) /
                                (1000 * 60 * 60),
                        )}{' '}
                        hr ago ⋅ {applicantsCountDisplay} applicants
                    </Text>
                    <View className="flex-row items-center bg-yellow-100 dark:bg-yellow-700/30 p-3 rounded-lg mb-4 border border-yellow-300 dark:border-yellow-600">
                        <Clock size={20} color="orange" className="mr-2" />
                        <Text className="text-sm text-yellow-700 dark:text-yellow-300">
                            {timeUntilCheckInDisplay}. Please, read{' '}
                            <Text className="font-bold text-red-600 dark:text-red-400">
                                PDF instruction
                            </Text>{' '}
                            (if available via Branch Link)
                        </Text>
                    </View>
                </View>

                {jobImagesToDisplay.length > 0 && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerClassName="px-4 py-3 bg-card">
                        {jobImagesToDisplay.map((img: string, index: number) => (
                            <Image
                                key={index}
                                source={{ uri: img }}
                                className="w-32 h-32 rounded-md mr-2"
                            />
                        ))}
                    </ScrollView>
                )}

                <View className="flex-row bg-card border-b border-border px-1 mt-1">
                    {tabs.map(tab => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            className={`py-3 px-4 mx-1 items-center justify-center border-b-2 ${activeTab === tab ? 'border-purple-600' : 'border-transparent'}`}>
                            <Text
                                className={`text-sm font-medium ${activeTab === tab ? 'text-purple-600' : 'text-muted-foreground'}`}>
                                {tab}
                            </Text>
                            {tab === 'About' && activeTab === tab && (
                                <View className="absolute bottom-[-1px] left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-purple-600 rounded-full" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {activeTab === 'About' && (
                    <View className="p-4 bg-card">
                        <View className="mb-6">
                            <Text className="text-xl font-bold text-foreground mb-2">
                                Schedule
                            </Text>
                            <Text className="text-sm text-muted-foreground mb-3">
                                {scheduleInfoDisplay}
                            </Text>
                            {/* Detailed daily schedule breakdown not available from API */}
                        </View>

                        <View className="mb-6">
                            <Text className="text-xl font-bold text-foreground mb-2">
                                Pay
                            </Text>
                            <Text className="text-sm text-muted-foreground mb-3">
                                Payment date – {paymentDateInfoDisplay}
                            </Text>

                            <View className="flex-row justify-between items-start py-3 border-b border-border">
                                <View>
                                    <Text className="text-base text-foreground font-medium">
                                        Hourly Rate
                                    </Text>
                                </View>
                                <View className="items-end">
                                    <Text className="text-base text-foreground font-semibold">
                                        {renderCurrencySymbol(jobDetails.hourlyWage.currencyId)}{' '}
                                        {jobDetails.hourlyWage.amount.toFixed(2)} per hour
                                    </Text>
                                </View>
                            </View>

                            <View className="flex-row justify-between items-start py-3">
                                <View>
                                    <Text className="text-base text-foreground font-medium">
                                        Salary (Total Estimated)
                                    </Text>
                                </View>
                                <View className="items-end">
                                    <Text className="text-base text-foreground font-semibold">
                                        {renderCurrencySymbol(jobDetails.salary.currencyId)}{' '}
                                        {jobDetails.salary.amount.toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                            {/* Allowances like meal, travel, other are not in the API response */}
                        </View>

                        <View className="mb-6">
                            <Text className="text-xl font-bold text-foreground mb-2">
                                Attached instruction (Branch Link)
                            </Text>
                            <Text className="text-sm text-muted-foreground mb-3">
                                {jobDetails.branchLink ? 
                                    "Click to view specific instructions or apply." : 
                                    "No specific instruction link provided."
                                }
                            </Text>
                            <TouchableOpacity 
                                onPress={async () => {
                                    if (jobDetails.branchLink && (jobDetails.branchLink.startsWith('http://') || jobDetails.branchLink.startsWith('https://'))) {
                                        try {
                                            await Linking.openURL(jobDetails.branchLink);
                                        } catch (err) {
                                            console.error("Failed to open URL:", err);
                                            // Optionally, show an alert to the user
                                        }
                                    } else if (jobDetails.branchLink) {
                                        // Handle non-http links if necessary, or treat as invalid
                                        console.warn("Branch link is not a valid http/https URL:", jobDetails.branchLink);
                                        // router.push(jobDetails.branchLink as any); // If it's an internal route, but API provides external
                                    }
                                }}
                                disabled={!jobDetails.branchLink}
                                className={`flex-row items-center justify-between p-3 border border-border rounded-lg ${jobDetails.branchLink ? 'bg-muted' : 'bg-card'}`}>
                                <View className="flex-row items-center">
                                    <FileText
                                        size={24}
                                        color={jobDetails.branchLink ? "purple" : "gray"}
                                        className="mr-3"
                                    />
                                    <Text className={`text-base font-medium ${jobDetails.branchLink ? 'text-foreground' : 'text-muted-foreground'}`}>
                                        {jobDetails.branchLink ? "Open Branch Link" : "Branch Link N/A"}
                                    </Text>
                                </View>
                                {jobDetails.branchLink && 
                                    <ChevronLeft
                                        size={20}
                                        className="text-muted-foreground"
                                        style={{
                                            transform: [{ rotate: '180deg' }],
                                        }}
                                    />
                                }
                            </TouchableOpacity>
                        </View>

                        <View className="mb-6">
                            <Text className="text-xl font-bold text-foreground mb-2">
                                Required experience
                            </Text>
                            <Text className="text-base text-foreground">
                                {requiredExperienceDisplay}
                            </Text>
                        </View>

                        <View>
                            <Text className="text-xl font-bold text-foreground mb-2">
                                Required skills
                            </Text>
                            <Text className="text-base text-foreground">
                                {requiredSkillsDisplay}
                            </Text>
                        </View>
                    </View>
                )}
                {activeTab === 'Requirements' && (
                    <View className="p-4 bg-card min-h-[200px]">
                        <Text className="text-lg font-bold text-foreground mb-1.5">
                            Requirements:
                        </Text>
                        <Text className="text-base text-foreground mb-2">
                            {jobDetails.requirements || 'No specific requirements listed.'}
                        </Text>
                        {jobDetails.clothingRequirements && (
                            <>
                                <Text className="text-lg font-bold text-foreground mt-3 mb-1.5">
                                    Clothing Requirements:
                                </Text>
                                <Text className="text-base text-foreground mb-2">
                                    {jobDetails.clothingRequirements}
                                </Text>
                            </>
                        )}
                    </View>
                )}
                {activeTab === 'Location' && (
                    <View className="p-4 bg-card min-h-[200px]">
                        <Text className="text-lg font-bold text-foreground mb-1.5">
                            Location:
                        </Text>
                        <Text className="text-base text-foreground">
                            {jobDetails.jobLocation.addressStreet || 'Address not specified'}
                            {jobDetails.jobLocation.extraAddress ? `, ${jobDetails.jobLocation.extraAddress}` : ''}
                            , {jobDetails.jobLocation.zip} {jobDetails.jobLocation.city}
                        </Text>
                        <View className="h-48 bg-muted my-4 rounded-lg items-center justify-center">
                            <MapPin
                                size={48}
                                className="text-muted-foreground"
                            />
                            <Text className="text-muted-foreground mt-2">
                                Map Placeholder (Coordinates not provided by API)
                            </Text>
                        </View>
                    </View>
                )}
                {activeTab === 'Process' && (
                    <View className="p-4 bg-card min-h-[200px]">
                        <Text className="text-lg font-bold text-foreground">
                            Application Process
                        </Text>
                        <Text className="text-base text-muted-foreground mt-2">
                            Refer to the Branch Link (if available in the 'About' tab) for application details.
                        </Text>
                    </View>
                )}
            </ScrollView>
            <View
                className="absolute bottom-0 left-0 right-0 flex-row justify-between p-4 border-t border-border bg-card"
                style={{ paddingBottom: insets.bottom + 16, paddingTop: 16 }}
            >
                <TouchableOpacity className="flex-1 bg-card border border-border rounded-lg py-3.5 mr-2 items-center justify-center">
                    <Text className="text-foreground text-base font-semibold">
                        Directions
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-rose-500 rounded-lg py-3.5 ml-2 items-center justify-center">
                    <Text className="text-white text-base font-semibold">
                        Report hours
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
