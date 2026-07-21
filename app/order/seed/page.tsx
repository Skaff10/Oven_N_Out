"use client";

import { useState } from "react";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, writeBatch, doc } from "firebase/firestore";
import { MENU_DATA } from "@/lib/menuData";
import Button from "@/components/ui/Button";

export default function SeedPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSeed = async () => {
    if (!isFirebaseConfigured || !db) {
      setStatus("error");
      setMessage(
        "Firebase is not configured. Please add your config to .env.local first."
      );
      return;
    }

    setStatus("loading");
    setMessage("Seeding menu items into Firestore...");

    try {
      const batch = writeBatch(db!);
      
      MENU_DATA.forEach((item) => {
        // Create doc with defined ID to prevent duplicate items on repeated seeds
        const docRef = doc(collection(db!, "menuItems"), item.id);
        
        // Remove id field from the payload since we use it as the document ID
        const { id: _, ...payload } = item;
        
        batch.set(docRef, {
          ...payload,
          createdAt: new Date(),
        });
      });

      await batch.commit();
      setStatus("success");
      setMessage(`Successfully seeded ${MENU_DATA.length} menu items into your Firestore collection!`);
    } catch (error: any) {
      console.error("Seeding error:", error);
      setStatus("error");
      setMessage(`Failed to seed data: ${error.message || error}`);
    }
  };

  return (
    <div className="w-full min-h-screen bg-dark pt-28 pb-16 font-body text-secondary flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-dark-card border border-dark-border rounded-2xl p-6 md:p-8 space-y-6 text-center shadow-2xl">
        <h1 className="font-heading text-2xl text-accent">FIRESTORE SEED UTILITY</h1>
        <p className="text-secondary/60 text-sm">
          Use this utility to populate your Firestore database with the Oven & Out menu items (Meat Box, Burgers, Wings, Pasta, etc.).
        </p>

        {status === "idle" && (
          <Button variant="primary" fullWidth onClick={handleSeed}>
            SEED DATABASE
          </Button>
        )}

        {status === "loading" && (
          <div className="space-y-3">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-accent text-sm font-semibold">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="text-green-400 text-lg font-heading">✓ Success</div>
            <p className="text-secondary/80 text-sm">{message}</p>
            <Link href="/order" className="inline-block w-full">
              <Button variant="outline" fullWidth>
                GO TO ORDER PAGE
              </Button>
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="text-red-400 text-lg font-heading">✗ Error</div>
            <p className="text-red-300 text-sm bg-red-950/30 border border-red-900/40 p-3 rounded-lg">
              {message}
            </p>
            <Button variant="primary" fullWidth onClick={() => setStatus("idle")}>
              TRY AGAIN
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Quick inline client wrapper link import fix
import Link from "next/link";
