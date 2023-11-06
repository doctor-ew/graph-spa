// /src/app/RickAndMorty/page.tsx
import React from 'react';
import RickCard from '@/components/RickCard';
import {RickAndMortyData} from '@/components/RickAndMortyDataTypes';

interface RickAndMortyPageProps {
    data: RickAndMortyData; // The type is imported from RickAndMortyDataTypes
}

const RickAndMortyPage: React.FC<RickAndMortyPageProps> = ({ data }) => {
    // Check if data exists and if rickAndMortyAssociations is part of the data
    if (!data || !data.rickAndMortyAssociations) {
        return <div>Loading...</div>; // Or any other loading state or error message
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Rick and Morty Data</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.rickAndMortyAssociations.map((association) => (
                    <RickCard key={association.rick.id} rick={association.rick} />
                    // ... We will create and use a MortyCard component next
                ))}
            </div>
        </div>
    );
};

export default RickAndMortyPage;
