CREATE INDEX IF NOT EXISTS "Event_published_date_idx" ON "Event"("published", "date");
CREATE INDEX IF NOT EXISTS "Event_communityId_idx" ON "Event"("communityId");
CREATE INDEX IF NOT EXISTS "TeamMember_role_displayOrder_idx" ON "TeamMember"("role", "displayOrder");
CREATE INDEX IF NOT EXISTS "GalleryImage_eventId_createdAt_idx" ON "GalleryImage"("eventId", "createdAt");
CREATE INDEX IF NOT EXISTS "Application_submittedAt_idx" ON "Application"("submittedAt");
CREATE INDEX IF NOT EXISTS "Application_status_submittedAt_idx" ON "Application"("status", "submittedAt");
