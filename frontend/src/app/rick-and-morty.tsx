import {NextPageContext} from "next";

export async function getServerSideProps(context: NextPageContext) {
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
