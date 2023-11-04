import React from 'react';
import { NextPageContext } from 'next';

interface RickAndMortyProps {
    data?: any; // You should replace 'any' with the actual data type you expect
    errors?: string;
}

// This is the React component that represents the page content
const RickAndMortyPage: React.FC<RickAndMortyProps> = ({ data, errors }) => {
    // Render your page with data and handle errors
    if (errors) {
        return <div>Error: {errors}</div>;
    }

    // Assuming 'data' contains the fetched data, render it accordingly
    return (
        <div>
            <h1>Rick and Morty Data</h1>
            {/* Display your Rick and Morty data here */}
            {/* This is a simplistic rendering example */}
            {data && data.rickAndMortyAssociations && (
                <div>
                    <h2>Ricks</h2>
                    {data.rickAndMortyAssociations.rick.map((rick:any) => (
                        <div key={rick.id}>
                            <p>{rick.name}</p>
                            {/* Add more details as needed */}
                        </div>
                    ))}
                    <h2>Morties</h2>
                    {data.rickAndMortyAssociations.morties.map((morty:any) => (
                        <div key={morty.id}>
                            <p>{morty.name}</p>
                            {/* Add more details as needed */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// This function runs on the server and gets the data for the page
export async function getServerSideProps(context: NextPageContext): Promise<{ props: RickAndMortyProps }> {
    try {
        const res = await fetch('http://localhost:4000/rickmorty', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
          {
            rickAndMortyAssociations {
              rick {
                id
                name
                status
                species
                type
                gender
                image
                episode {
                  id
                  name
                }
              }
              morties {
                id
                name
                status
                species
                type
                gender
                image
                episode {
                  id
                  name
                }
              }
            }
          }
        `,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            console.error('Response not ok:', res);
            throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }

        if (data.errors) {
            console.error('GraphQL Errors:', data.errors);
            throw new Error('Failed to fetch GraphQL data.');
        }

        return {
            props: { data: data.data },
        };
    } catch (error: any) {
        console.error('Error in getServerSideProps:', error);
        return {
            props: { errors: error.message },
        };
    }
}

// Make sure to export the React component as the default export
export default RickAndMortyPage;
