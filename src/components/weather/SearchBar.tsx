"use client";

import type { FormEvent } from 'react';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, LocateFixed } from "lucide-react";

interface SearchBarProps {
  onSearch: (location: string) => void;
  onGeolocate: () => void;
  loading: boolean;
  geolocationLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onGeolocate, loading, geolocationLoading }) => {
  const [locationInput, setLocationInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (locationInput.trim()) {
      onSearch(locationInput.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl items-center space-x-2 mb-8">
      <Input
        type="text"
        placeholder="Enter city name or zip code"
        value={locationInput}
        onChange={(e) => setLocationInput(e.target.value)}
        className="flex-grow text-base"
        aria-label="Search location"
      />
      <Button type="submit" disabled={loading || !locationInput.trim()} aria-label="Search">
        <Search className="h-5 w-5" />
      </Button>
      <Button type="button" variant="outline" onClick={onGeolocate} disabled={geolocationLoading || loading} aria-label="Use current location">
        <LocateFixed className="h-5 w-5" />
      </Button>
    </form>
  );
};
