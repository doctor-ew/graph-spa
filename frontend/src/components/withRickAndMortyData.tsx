// withRickAndMortyData.tsx
import React, { ComponentType } from 'react';
import { RickAndMortyData } from './RickAndMortyDataTypes';

interface WithRickAndMortyDataProps {
    data: RickAndMortyData;
}

export function withRickAndMortyData<P extends WithRickAndMortyDataProps>(
    WrappedComponent: ComponentType<P>
): ComponentType<Omit<P, 'data'>> {
    // This function will be called by Next.js to fetch data for the page
    const getServerSideProps = async (context:any) => {
        const endpoint = 'http://backend:4000/rickmorty';
        const requestBody = {
            query: `
            {
              rickAndMortyAssociations {
                rick {
                  id
                  name
                  origin {
                    id
                    name
                  }
                  location {
                    id
                    name
                  }
                  image
                }
                morties {
                  id
                  name
                  origin {
                    id
                    name
                  }
                  location {
                    id
                    name
                  }
                  image
                }
              }
            }
          `,
        };

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const result = await res.json();

        if (!res.ok || result.errors) {
            return {
                props: {
                    data: null,
                    error: `Failed to fetch: ${res.status} ${res.statusText}`,
                },
            };
        }

        return {
            props: {
                data: result.data,
            },
        };
    };

    // The HOC component wraps the original component
    const WithRickAndMortyData: React.FC<Omit<P, 'data'>> = (props) => {
        return <WrappedComponent {...(props as P)} />;
    };

    // Assign the getServerSideProps function to the HOC
    (WithRickAndMortyData as any).getServerSideProps = getServerSideProps;

    return WithRickAndMortyData;
}

function getDisplayName<P>(WrappedComponent: ComponentType<P>): string {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withRickAndMortyData;
