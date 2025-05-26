import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import JobDetailsScreenComponent from '~/screens/JobDetailsScreen';

export default function JobDetailsPageRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <JobDetailsScreenComponent id={id} />
  );
} 