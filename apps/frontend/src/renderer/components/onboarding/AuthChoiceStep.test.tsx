/**
 * @vitest-environment jsdom
 */
/**
 * AuthChoiceStep component tests
 *
 * Tests for the authentication choice step in the onboarding wizard.
 * Verifies OAuth button, API Key button, skip button, and ProfileEditDialog integration.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@shared/i18n';
import { AuthChoiceStep } from './AuthChoiceStep';
import type { APIProfile } from '@shared/types/profile';

// Wrapper component for i18n
const I18nWrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);

// Mock the settings store
const mockGoToNext = vi.fn();
const mockGoToPrevious = vi.fn();
const mockSkipWizard = vi.fn();
const mockOnAPIKeyPathComplete = vi.fn();

// Dynamic profiles state for testing
let mockProfiles: APIProfile[] = [];

const mockUseSettingsStore = (selector?: any) => {
  const state = {
    profiles: mockProfiles,
    profilesLoading: false,
    profilesError: null,
    setProfiles: vi.fn((newProfiles) => { mockProfiles = newProfiles; }),
    setProfilesLoading: vi.fn(),
    setProfilesError: vi.fn(),
    saveProfile: vi.fn(),
    updateProfile: vi.fn(),
    deleteProfile: vi.fn(),
    setActiveProfile: vi.fn()
  };
  if (!selector || selector.toString().includes('profiles')) {
    return state;
  }
  return selector(state);
};

vi.mock('../../stores/settings-store', () => ({
  useSettingsStore: vi.fn((selector) => mockUseSettingsStore(selector))
}));

// Mock ProfileEditDialog
vi.mock('../settings/ProfileEditDialog', () => ({
  ProfileEditDialog: ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
    if (!open) return null;
    return (
      <div data-testid="profile-edit-dialog">
        <button type="button" onClick={() => onOpenChange(false)}>Close Dialog</button>
      </div>
    );
  }
}));

describe('AuthChoiceStep', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset profiles state to ensure clean state for each test
    mockProfiles = [];
  });

  describe('Rendering', () => {
    it('should render the auth choice step with all elements', () => {
      render(
        <I18nWrapper><AuthChoiceStep
          onNext={mockGoToNext}
          onBack={mockGoToPrevious}
          onSkip={mockSkipWizard}
        /></I18nWrapper>
      );

      // Check for heading
      expect(screen.getByText('Choose Your Authentication Method')).toBeInTheDocument();

      // Check for OAuth option
      expect(screen.getByText('Sign in with Anthropic')).toBeInTheDocument();

      // Check for API Key option
      expect(screen.getByText('Use Custom API Key')).toBeInTheDocument();

      // Check for skip button
      expect(screen.getByText('Skip for now')).toBeInTheDocument();
    });

    it('should display two auth option cards with equal visual weight', () => {
      const { container } = render(
        <I18nWrapper><AuthChoiceStep
          onNext={mockGoToNext}
          onBack={mockGoToPrevious}
          onSkip={mockSkipWizard}
        /></I18nWrapper>
      );

      // Check for grid layout with two columns
      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
      expect(grid?.className).toContain('lg:grid-cols-2');
    });

    it('should show icons for each auth option', () => {
      render(
        <I18nWrapper><AuthChoiceStep
          onNext={mockGoToNext}
          onBack={mockGoToPrevious}
          onSkip={mockSkipWizard}
        /></I18nWrapper>
      );

      // Both cards should have icon containers
      const iconContainers = document.querySelectorAll('.bg-primary\\/10');
      expect(iconContainers.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('OAuth Button Handler', () => {
    it('should call onNext when OAuth button is clicked', () => {
      render(
        <I18nWrapper><AuthChoiceStep
          onNext={mockGoToNext}
          onBack={mockGoToPrevious}
          onSkip={mockSkipWizard}
        /></I18nWrapper>
      );

      const oauthButton = screen.getByText('Sign in with Anthropic').closest('.cursor-pointer');
      fireEvent.click(oauthButton!);

      expect(mockGoToNext).toHaveBeenCalledTimes(1);
    });

    it('should proceed to oauth step when OAuth is selected', () => {
      render(
        <I18nWrapper><AuthChoiceStep
          onNext={mockGoToNext}
          onBack={mockGoToPrevious}
          onSkip={mockSkipWizard}
        /></I18nWrapper>
      );

      const oauthButton = screen.getByText('Sign in with Anthropic').closest('.cursor-pointer');
      fireEvent.click(oauthButton!);

      expect(mockGoToNext).toHaveBeenCalled();
      expect(mockOnAPIKeyPathComplete).not.toHaveBeenCalled();
    });
  });

  describe('API Key Button Handler', () => {
    it('should open ProfileEditDialog when API Key button is clicked', () => {
      render(
        <I18nWrapper><AuthChoiceStep
          onNext={mockGoToNext}
          onBack={mockGoToPrevious}
          onSkip={mockSkipWizard}
        /></I18nWrapper>
      );

      const apiKeyButton = screen.getByText('Use Custom API Key').closest('.cursor-pointer');
      fireEvent.click(apiKeyButton!);

      // ProfileEditDialog should be rendered
      expect(screen.getByTestId('profile-edit-dialog')).toBeInTheDocument();
    });

    it('should accept onAPIKeyPathComplete callback prop', async () => {
      // This test verifies the component accepts the callback prop
      // Full integration testing of profile creation detection requires E2E tests
      // due to the complex state management between dialog and store
      mockProfiles = [];

      render(
        <I18nWrapper><AuthChoiceStep
          onNext={mockGoToNext}
          onBack={mockGoToPrevious}
          onSkip={mockSkipWizard}
          onAPIKeyPathComplete={mockOnAPIKeyPathComplete}
        /></I18nWrapper>
      );

      // Click API Key button to open dialog
      const apiKeyButton = screen.getByText('Use Custom API Key').closest('.cursor-pointer');
      fireEvent.click(apiKeyButton!);

      // Dialog should be open - verifies the API key path works
      expect(screen.getByTestId('profile-edit-dialog')).toBeInTheDocument();

      // Close dialog without creating profile
      const closeButton = screen.getByText('Close Dialog');
      fireEvent.click(closeButton);

      // Callback should NOT be called when no profile was created (profiles still empty)
      expect(mockOnAPIKeyPathComplete).not.toHaveBeenCalled();
    });
  });

  describe('Skip Button Handler', () => {
    it('should call onSkip when skip button is clicked', () => {
      render(
        <I18nWrapper><AuthChoiceStep
          onNext={mockGoToNext}
          onBack={mockGoToPrevious}
          onSkip={mockSkipWizard}
        /></I18nWrapper>
      );

      const skipButton = screen.getByText('Skip for now');
      fireEvent.click(skipButton);

      expect(mockSkipWizard).toHaveBeenCalledTimes(1);
    });

    it('should have ghost variant for skip button', () => {
      render(
        <I18nWrapper><AuthChoiceStep
          onNext={mockGoToNext}
          onBack={mockGoToPrevious}
          onSkip={mockSkipWizard}
        /></I18nWrapper>
      );

      const skipButton = screen.getByText('Skip for now');
      // Ghost variant buttons have specific styling classes
      expect(skipButton.className).toContain('text-muted-foreground');
      expect(skipButton.className).toContain('hover:text-foreground');
    });
  });

  describe('Visual Consistency', () => {
    it('should follow WelcomeStep visual pattern', () => {
      const { container } = render(
        <I18nWrapper><AuthChoiceStep
          onNext={mockGoToNext}
          onBack={mockGoToPrevious}
          onSkip={mockSkipWizard}
        /></I18nWrapper>
      );

      // Check for container with proper classes
      const mainContainer = container.querySelector('.flex.h-full.flex-col');
      expect(mainContainer).toBeInTheDocument();

      // Check for max-w-2xl content wrapper
      const contentWrapper = container.querySelector('.max-w-2xl');
      expect(contentWrapper).toBeInTheDocument();

      // Check for centered text
      const centeredText = container.querySelector('.text-center');
      expect(centeredText).toBeInTheDocument();
    });

    it('should display hero icon with shield', () => {
      const { container } = render(
        <I18nWrapper><AuthChoiceStep
          onNext={mockGoToNext}
          onBack={mockGoToPrevious}
          onSkip={mockSkipWizard}
        /></I18nWrapper>
      );

      // Shield icon should be in a circle
      const heroIcon = container.querySelector('.h-16.w-16');
      expect(heroIcon).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have descriptive text for each auth option', () => {
      render(
        <I18nWrapper><AuthChoiceStep
          onNext={mockGoToNext}
          onBack={mockGoToPrevious}
          onSkip={mockSkipWizard}
        /></I18nWrapper>
      );

      // OAuth option description
      expect(screen.getByText(/Use your Anthropic account to authenticate/)).toBeInTheDocument();

      // API Key option description
      expect(screen.getByText(/Bring your own API key/)).toBeInTheDocument();
    });

    it('should have helper text explaining both options', () => {
      render(
        <I18nWrapper><AuthChoiceStep
          onNext={mockGoToNext}
          onBack={mockGoToPrevious}
          onSkip={mockSkipWizard}
        /></I18nWrapper>
      );

      expect(screen.getByText(/Both options provide full access to Claude Code features/)).toBeInTheDocument();
    });
  });

  describe('AC Coverage', () => {
    it('AC1: should display first-run screen with two clear options', () => {
      render(
        <I18nWrapper><AuthChoiceStep
          onNext={mockGoToNext}
          onBack={mockGoToPrevious}
          onSkip={mockSkipWizard}
        /></I18nWrapper>
      );

      // Two main options visible
      expect(screen.getByText('Sign in with Anthropic')).toBeInTheDocument();
      expect(screen.getByText('Use Custom API Key')).toBeInTheDocument();

      // Both should be clickable cards
      const cards = document.querySelectorAll('.cursor-pointer');
      expect(cards.length).toBeGreaterThanOrEqual(2);
    });
  });
});
