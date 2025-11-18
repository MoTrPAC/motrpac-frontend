import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InteractiveBiospecimenChart from '../InteractiveBiospecimenChart';
import { DEFAULT_FILTERS, filterUtils } from '../../constants/plotOptions';

// Mock child components
vi.mock('../BiospecimenFilters', () => ({
  default: ({ onResetFilters, onCheckboxChange }) => (
    <div data-testid="biospecimen-filters">
      <button onClick={onResetFilters} data-testid="reset-filters-btn">
        Reset Filters
      </button>
      <button 
        onClick={() => onCheckboxChange('sex', 'Male', false)} 
        data-testid="change-filter-btn"
      >
        Change Filter
      </button>
    </div>
  ),
}));

vi.mock('../BiospecimenChart', () => ({
  default: ({ onBarClick }) => (
    <div data-testid="biospecimen-chart">
      <button 
        onClick={() => onBarClick({ 
          point: { 
            tissue: 'Adipose', 
            phase: 'Pre-Intervention', 
            samples: [{ vial_label: 'V001' }],
            y: 1,
            count: 1
          } 
        })} 
        data-testid="chart-bar-btn"
      >
        Click Bar
      </button>
    </div>
  ),
}));

vi.mock('../PaginationControls', () => ({
  default: ({ pagination, onExport }) => (
    <div data-testid="pagination-controls">
      <div data-testid="pagination-total">{pagination.totalItems}</div>
      {onExport && (
        <button onClick={onExport} data-testid="export-btn">
          Export CSV
        </button>
      )}
    </div>
  ),
}));

vi.mock('../../hooks/useAdvancedPagination', () => ({
  useAdvancedPagination: (data) => ({
    currentPageData: data.slice(0, 20),
    totalItems: data.length,
    resetPagination: vi.fn(),
    currentPage: 1,
    totalPages: Math.ceil(data.length / 20),
    pageSize: 20,
  }),
}));

// Mock hooks
vi.mock('../../hooks/useBiospecimenData', () => ({
  useBiospecimenData: () => ({
    allData: [
      { vial_label: 'V001', sex: 'Male', pid: 'P001', bmi: 25.5, sample_group_code: 'ADI' },
      { vial_label: 'V002', sex: 'Female', pid: 'P002', bmi: 22.3, sample_group_code: 'BLO' },
      { vial_label: 'V003', sex: 'Male', pid: 'P003', bmi: 45.0, sample_group_code: 'MUS' }, // BMI >= 40 (unmapped)
      { vial_label: 'V004', sex: 'Female', pid: 'P004', sample_group_code: null }, // No tissue (null)
    ],
    loading: false,
    error: null,
    refresh: vi.fn(),
  }),
  useFilteredBiospecimenData: (allData, filters) => {
    // Mock filtering that matches actual implementation:
    // Only filter out records with values that DON'T match selected filters
    // Keep records with null/unmapped values (don't filter based on missing data)
    return allData.filter(item => {
      // Filter by sex
      if (filters.sex?.length > 0) {
        if (item.sex && !filters.sex.includes(item.sex)) {
          return false;
        }
      }
      
      // Filter by tissue - only exclude if HAS tissue that doesn't match
      if (filters.tissue?.length > 0) {
        const tissueMap = { 'ADI': 'Adipose', 'BLO': 'Blood', 'MUS': 'Muscle' };
        const tissueName = tissueMap[item.sample_group_code];
        if (tissueName && !filters.tissue.includes(tissueName)) {
          return false;
        }
      }
      
      return true;
    });
  },
}));

// Mock URL.createObjectURL and related functions for CSV export
global.URL.createObjectURL = vi.fn(() => 'mock-blob-url');
global.URL.revokeObjectURL = vi.fn();

describe('InteractiveBiospecimenChart - Filter Reset & Table Display', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test suite covers:
  // 1. Reset button functionality (clears filters + drill-down selection)
  // 2. Always-visible table (shows filtered records or drill-down data)
  // 3. Mode switching (filtered ↔ drill-down)
  // 4. Export functionality for both modes
  // 5. UI indicators (headers, icons, sample counts)
  // 6. Filter logic correctly handles null/unmapped values (NEW)

  test('renders reset button and filters', () => {
    render(<InteractiveBiospecimenChart />);
    
    expect(screen.getByTestId('biospecimen-filters')).toBeInTheDocument();
    expect(screen.getByTestId('reset-filters-btn')).toBeInTheDocument();
  });

  test('shows filtered table by default with all records (including null/unmapped values)', () => {
    render(<InteractiveBiospecimenChart />);
    
    // Table should be visible
    expect(screen.getByRole('table')).toBeInTheDocument();
    
    // Should show "Biospecimen Records" header with count
    expect(screen.getByText(/Biospecimen Records/i)).toBeInTheDocument();
    // All 4 records should be included (V001, V002, V003 with BMI>=40, V004 with null tissue)
    expect(screen.getByText(/4 samples/i)).toBeInTheDocument();
  });

  test('filters keep records with unmapped values (BMI >= 40)', () => {
    render(<InteractiveBiospecimenChart />);
    
    // With DEFAULT_FILTERS (all options selected), all 4 records should show
    const pagination = screen.getAllByTestId('pagination-total')[0];
    expect(pagination).toHaveTextContent('4');
    
    // Record V003 has BMI = 45.0 (not in any BMI group), but should still be included
  });

  test('filters keep records with null values (no tissue)', () => {
    render(<InteractiveBiospecimenChart />);
    
    // Record V004 has null sample_group_code, but should still be included
    const pagination = screen.getAllByTestId('pagination-total')[0];
    expect(pagination).toHaveTextContent('4');
  });

  test('handleResetFilters clears filters and selection', () => {
    const resetSpy = vi.spyOn(filterUtils, 'resetToDefaults');
    
    render(<InteractiveBiospecimenChart />);
    
    // Click bar to select it
    const barBtn = screen.getByTestId('chart-bar-btn');
    fireEvent.click(barBtn);
    
    // Verify drill-down header appears with tissue info
    expect(screen.getByText(/Adipose/i)).toBeInTheDocument();
    
    // Click reset
    const resetBtn = screen.getByTestId('reset-filters-btn');
    fireEvent.click(resetBtn);
    
    // Verify filters reset
    expect(resetSpy).toHaveBeenCalled();
    
    // Verify back to filtered mode (check for "Biospecimen Records" header)
    expect(screen.getByText(/Biospecimen Records/i)).toBeInTheDocument();
  });

  test('handleClearSelection returns to filtered view', () => {
    render(<InteractiveBiospecimenChart />);
    
    // Click bar to enter drill-down
    const barBtn = screen.getByTestId('chart-bar-btn');
    fireEvent.click(barBtn);
    
    // Verify drill-down active (Adipose header appears)
    expect(screen.getByText(/Adipose/i)).toBeInTheDocument();
    
    // Find and click the drill-down reset button (shows as "Reset" in header)
    const clearBtn = screen.getByRole('button', { name: /Clear drill-down selection/i });
    fireEvent.click(clearBtn);
    
    // Verify back to filtered mode
    expect(screen.getByText(/Biospecimen Records/i)).toBeInTheDocument();
  });

  test('filter change updates displayed records', () => {
    render(<InteractiveBiospecimenChart />);
    
    // Initially shows all 4 records
    let pagination = screen.getAllByTestId('pagination-total')[0];
    expect(pagination).toHaveTextContent('4');
    
    // Change filter to only show Males
    const changeFilterBtn = screen.getByTestId('change-filter-btn');
    fireEvent.click(changeFilterBtn);
    
    // Should now show only 2 records (V001 and V003 are Male)
    pagination = screen.getAllByTestId('pagination-total')[0];
    expect(pagination).toHaveTextContent('2');
  });

  test('tableData computes correctly for filtered vs drill-down', () => {
    render(<InteractiveBiospecimenChart />);
    
    // Initially filtered - check pagination shows 4 items
    const initialPagination = screen.getAllByTestId('pagination-total')[0];
    expect(initialPagination).toHaveTextContent('4');
    
    // Click bar to drill down
    const barBtn = screen.getByTestId('chart-bar-btn');
    fireEvent.click(barBtn);
    
    // Should show drill-down data (1 item from mock)
    const drilldownPagination = screen.getAllByTestId('pagination-total')[0];
    expect(drilldownPagination).toHaveTextContent('1');
  });

  test('export function called with correct data', () => {
    render(<InteractiveBiospecimenChart />);
    
    // Find export button
    const exportBtn = screen.getAllByTestId('export-btn')[0];
    
    // Click export in filtered mode
    fireEvent.click(exportBtn);
    
    // Verify export was triggered (URL methods called)
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    
    // Clear mocks for next test
    vi.clearAllMocks();
    
    // Click bar to enter drill-down
    const barBtn = screen.getByTestId('chart-bar-btn');
    fireEvent.click(barBtn);
    
    // Export in drill-down mode
    const drilldownExportBtn = screen.getAllByTestId('export-btn')[0];
    fireEvent.click(drilldownExportBtn);
    
    // Verify export works in drill-down mode too
    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  test('always-visible table section renders', () => {
    render(<InteractiveBiospecimenChart />);
    
    // Table should always be visible
    expect(screen.getByRole('table')).toBeInTheDocument();
    
    // Should have pagination controls
    expect(screen.getAllByTestId('pagination-controls').length).toBeGreaterThan(0);
  });

  test('header shows correct mode indicators', () => {
    render(<InteractiveBiospecimenChart />);
    
    // Initially filtered mode - shows "Biospecimen Records" with table icon
    expect(screen.getByText(/Biospecimen Records/i)).toBeInTheDocument();
    expect(screen.getByText(/4 samples/i)).toBeInTheDocument();
    
    // Click bar for drill-down
    const barBtn = screen.getByTestId('chart-bar-btn');
    fireEvent.click(barBtn);
    
    // Should show drill-down with tissue/phase info and bar chart icon
    expect(screen.getByText(/Adipose/i)).toBeInTheDocument();
    expect(screen.getByText(/Pre-Intervention/i)).toBeInTheDocument();
    expect(screen.queryByText(/Biospecimen Records/i)).not.toBeInTheDocument();
  });

  test('filter change clears drill-down selection and returns to filtered view', () => {
    render(<InteractiveBiospecimenChart />);
    
    // Click bar to enter drill-down
    const barBtn = screen.getByTestId('chart-bar-btn');
    fireEvent.click(barBtn);
    
    // Verify drill-down active (Adipose header appears)
    expect(screen.getByText(/Adipose/i)).toBeInTheDocument();
    
    // Change filter (this should clear selection)
    const changeFilterBtn = screen.getByTestId('change-filter-btn');
    fireEvent.click(changeFilterBtn);
    
    // Should return to filtered view
    expect(screen.getByText(/Biospecimen Records/i)).toBeInTheDocument();
    expect(screen.queryByText(/Adipose/i)).not.toBeInTheDocument();
  });
});
