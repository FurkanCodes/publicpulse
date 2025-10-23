// // /workspaces/publicpulse/app/page.tsx

// import { Features } from "./(main)/Features";
// import fetchRoadmapItems from "@/data-access/fetch-roadmaps-items";
// import { auth } from "@/lib/auth";

// import { headers } from "next/headers";

// export default async function HomePage() {
//   // fetchRoadmapItems() returns an object: { items: [], error: null }
//   const result = await fetchRoadmapItems();

// const session = await auth.api.getSession({
//     headers: await headers() // you need to pass the headers object.
// })
//   console.log("Fetched roadmap items:", result.items);
//   console.log("User session:", session);
//   return (
//     <main className="container mx-auto p-8">
//       <h1 className="text-4xl font-bold mb-4">ClearPath Roadmap</h1>
//  {session?.user ? (<p>Welcome back, {session.user.email} <Features roadmapItems={result.items || []} /></p>
//  ) : (
// <p>Please sign in to access more features. </p>
//  )  }
     
//     </main>
//   );
// }

import { UserMenu } from "@/components/user-menu"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <main className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Welcome to ClearPath</h1>
        <UserMenu />
      </div>

      {session?.user ? (
        <div className="space-y-4">
          <p className="text-lg">Welcome back, {session.user.name || session.user.email}!</p>
          <p className="text-muted-foreground">You are now signed in and can access all features.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-lg">Please sign in to access more features.</p>
          <p className="text-muted-foreground">Create an account or sign in to get started.</p>
        </div>
      )}
    </main>
  )
}
