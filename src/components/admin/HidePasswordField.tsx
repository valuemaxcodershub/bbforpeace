'use client'

import { useAuth } from '@payloadcms/ui'
import React from 'react'

/**
 * Provider component that hides password fields for non-super-admin users.
 * Registered as a Payload admin provider so it wraps the entire admin UI.
 */
export function HidePasswordField({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const role = (user as any)?.role

  return (
    <>
      {role && role !== 'super-admin' && (
        <style>{`
          /* Hide password fields for non-super-admin users */
          .field-type.password,
          [class*="field-type"][class*="password"],
          .field-type.confirmPassword,
          [class*="field-type"][class*="confirmPassword"],
          [data-field-name="password"],
          [data-field-name="confirm-password"] {
            display: none !important;
          }
        `}</style>
      )}
      {children}
    </>
  )
}
