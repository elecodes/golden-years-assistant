import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RemindersDashboard } from './pages/RemindersDashboard';
import { useStore } from './store/useStore';

// Mock the stores
vi.mock('./store/useStore', () => ({
  useStore: vi.fn(),
}));

// Mock speak function
vi.mock('./utils/voice', () => ({
  speak: vi.fn(),
}));

describe('RemindersDashboard', () => {
  const mockMedications = [
    { 
      id: 'm1', 
      name: 'Blood Pressure Pill', 
      dosage: '10mg', 
      stock: 12, 
      frequency: 'DAILY' as const,
      scheduledTimes: ['08:00', '20:00'],
      createdAt: Date.now(),
    },
    { 
      id: 'm2', 
      name: 'Vitamin D', 
      dosage: '2000 IU', 
      stock: 45, 
      frequency: 'DAILY' as const,
      scheduledTimes: ['08:00'],
      createdAt: Date.now(),
    },
    { 
      id: 'm3', 
      name: 'Pain Relief', 
      dosage: '200mg', 
      stock: 5, 
      frequency: 'DAILY' as const,
      scheduledTimes: ['14:00'],
      createdAt: Date.now(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('empty state', () => {
    it('should display empty state when no medications exist', () => {
      (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        medications: [],
        logs: [],
      });

      render(<RemindersDashboard />);

      expect(screen.getByText('No medications scheduled')).toBeInTheDocument();
      expect(screen.getByText(/Add your first medication/i)).toBeInTheDocument();
    });
  });

  describe('with medications', () => {
    beforeEach(() => {
      (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        medications: mockMedications,
        logs: [],
      });
    });

    it('should display medications grouped by time of day', () => {
      render(<RemindersDashboard />);

      expect(screen.getByText('Morning')).toBeInTheDocument();
      expect(screen.getByText('Afternoon')).toBeInTheDocument();
      expect(screen.getByText('Evening')).toBeInTheDocument();
    });

    it('should display medication names', () => {
      render(<RemindersDashboard />);

      expect(screen.getAllByText('Blood Pressure Pill').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Vitamin D').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Pain Relief').length).toBeGreaterThan(0);
    });

    it('should display medication dosages', () => {
      render(<RemindersDashboard />);

      expect(screen.getAllByText('10mg').length).toBeGreaterThan(0);
      expect(screen.getAllByText('2000 IU').length).toBeGreaterThan(0);
      expect(screen.getAllByText('200mg').length).toBeGreaterThan(0);
    });

    it('should display scheduled times', () => {
      render(<RemindersDashboard />);

      // Check for formatted times (8:00 AM, 2:00 PM, 8:00 PM)
      expect(screen.getAllByText(/8:00 AM/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/2:00 PM/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/8:00 PM/i).length).toBeGreaterThan(0);
    });

    it('should show Take and Skip buttons for pending medications', () => {
      render(<RemindersDashboard />);

      const takeButtons = screen.getAllByRole('button', { name: /Take/i });
      const skipButtons = screen.getAllByRole('button', { name: /Skip/i });

      expect(takeButtons.length).toBeGreaterThan(0);
      expect(skipButtons.length).toBeGreaterThan(0);
    });

    it('should group medications under correct time periods', () => {
      render(<RemindersDashboard />);

      const morningSection = screen.getByLabelText('Morning');
      expect(morningSection).toHaveTextContent('Blood Pressure Pill');
      expect(morningSection).toHaveTextContent('Vitamin D');

      const afternoonSection = screen.getByLabelText('Afternoon');
      expect(afternoonSection).toHaveTextContent('Pain Relief');
    });
  });

  describe('with logged medications', () => {
    it('should show taken status when medication is logged as taken', () => {
      const now = Date.now();
      (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        medications: [mockMedications[0]],
        logs: [
          { 
            id: 'log1', 
            medId: 'm1', 
            status: 'Taken' as const, 
            timestamp: now,
            scheduledTime: '08:00',
          },
        ],
      });

      render(<RemindersDashboard />);

      // Should show Taken badge
      expect(screen.getByText('Taken')).toBeInTheDocument();
    });

    it('should show skipped status when medication is logged as skipped', () => {
      const now = Date.now();
      (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        medications: [mockMedications[0]],
        logs: [
          { 
            id: 'log1', 
            medId: 'm1', 
            status: 'Skipped' as const, 
            timestamp: now,
            scheduledTime: '08:00',
          },
        ],
      });

      render(<RemindersDashboard />);

      // Should show Skipped badge
      expect(screen.getByText('Skipped')).toBeInTheDocument();
    });

    it('should not duplicate taken/skipped badges in empty state', () => {
      (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        medications: [],
        logs: [],
      });

      render(<RemindersDashboard />);

      expect(screen.queryByText('Taken')).not.toBeInTheDocument();
      expect(screen.queryByText('Skipped')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper heading structure', () => {
      (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        medications: mockMedications,
        logs: [],
      });

      render(<RemindersDashboard />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent("Today's Reminders");
    });

    it('should have navigation landmarks', () => {
      (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        medications: mockMedications,
        logs: [],
      });

      render(<RemindersDashboard />);

      // RemindersDashboard creates multiple regions (time groups), at least one should exist
      expect(screen.getAllByRole('region').length).toBeGreaterThan(0);
    });
  });
});
