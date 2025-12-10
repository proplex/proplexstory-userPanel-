"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsConditionProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export const PrivacyPolicy = ({
  isOpen,
  onAccept,
  onDecline,
}: TermsConditionProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => onDecline()}>
      <DialogContent className="max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Privacy Policy
              </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-2">1. Introduction</h3>
              <p className="text-sm text-muted-foreground">
                Welcome to our platform. By accessing or using our services, you
                agree to be bound by these terms and conditions.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">2. User Obligations</h3>
              <p className="text-sm text-muted-foreground">
                You must be at least 18 years old to use our services. You agree to
                provide accurate and complete information when creating an account.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">3. Privacy Policy</h3>
              <p className="text-sm text-muted-foreground">
                Your use of our service is also governed by our Privacy Policy. Please
                review our Privacy Policy to understand our practices.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">
                4. Intellectual Property
              </h3>
              <p className="text-sm text-muted-foreground">
                All content, features, and functionality of our service are owned by
                us and are protected by international copyright, trademark, and
                other intellectual property laws.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">
                5. Service Modifications
              </h3>
              <p className="text-sm text-muted-foreground">
                We reserve the right to modify or discontinue our service at any
                time without notice. We shall not be liable to you or any third
                party for any modification, suspension, or discontinuance.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">6. Limitation of Liability</h3>
              <p className="text-sm text-muted-foreground">
                We shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages resulting from your use or
                inability to use the service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">7. Governing Law</h3>
              <p className="text-sm text-muted-foreground">
                These terms shall be governed by and construed in accordance with
                the laws of your jurisdiction, without regard to its conflict of
                law provisions.
              </p>
            </section>
          </div>
        </ScrollArea>

        <DialogFooter className="flex gap-2 mt-4">
          <Button variant="outline" onClick={onDecline}>
            Decline
          </Button>
          <Button onClick={onAccept}>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicy;
