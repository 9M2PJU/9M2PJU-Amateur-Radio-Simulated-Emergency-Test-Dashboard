import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Station } from '../types/index';

export const exportStationsToPDF = (stations: Station[]) => {
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();
    const filename = `9M2PJU_SITREP_${new Date().toISOString().split('T')[0]}.pdf`;

    // --- Header ---
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 40, 'F');

    // Add Logo
    try {
        // We use the logo.png from the public directory
        doc.addImage('/logo.png', 'PNG', 14, 8, 24, 24);
    } catch (e) {
        console.error('Failed to add logo to PDF:', e);
    }

    doc.setTextColor(34, 211, 238); // cyan-400
    doc.setFontSize(20);
    doc.text('SITUATION REPORT', 105, 18, { align: 'center' });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('9M2PJU SIMULATED EMERGENCY TEST DASHBOARD', 105, 26, { align: 'center' });
    doc.text(`DATE/TIME: ${timestamp}`, 105, 33, { align: 'center' });

    // --- Executive Summary ---
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.text('I. EXECUTIVE SUMMARY', 14, 50);

    doc.setFontSize(10);
    const activeCount = stations.filter(s => s.status === 'active').length;
    const emergencyCount = stations.filter(s => s.status === 'emergency').length;
    const totalStations = stations.length;

    const summary = `As of ${timestamp}, a total of ${totalStations} stations are registered in the 9M2PJU SET Dashboard. ` +
        `Current system status shows ${emergencyCount} stations in EMERGENCY state and ${activeCount} stations ACTIVE. ` +
        `Operational readiness is maintained via radio network. All data is current.`;

    const splitSummary = doc.splitTextToSize(summary, 182);
    doc.text(splitSummary, 14, 58);

    // --- Analytical Analysis & Metrics ---
    doc.setFontSize(14);
    doc.text('II. OPERATIONAL ANALYTICS', 14, 85);

    const batteryPower = stations.filter(s => s.powerSource === 'battery').length;
    const mainsPower = stations.filter(s => s.powerSource === 'main').length;

    const batteryReadiness = totalStations > 0 ? Math.round((batteryPower / totalStations) * 100) : 0;
    const mainsReliance = totalStations > 0 ? Math.round((mainsPower / totalStations) * 100) : 0;

    // Table for metrics
    autoTable(doc, {
        startY: 92,
        head: [['Metric', 'Value', 'Status']],
        body: [
            ['Total Deployed Stations', totalStations, 'NOMINAL'],
            ['Emergency Declarations', emergencyCount, emergencyCount > 0 ? 'CRITICAL' : 'CLEAR'],
            ['Active Response Units', activeCount, 'OPERATIONAL'],
            ['Battery / Off-Grid Power', batteryPower, `${batteryReadiness}% Readiness`],
            ['Mains / Grid Power', mainsPower, `${mainsReliance}% Reliance`],
        ],
        theme: 'striped',
        headStyles: { fillColor: [34, 211, 238], textColor: [255, 255, 255] },
    });

    // --- Station Directory ---
    const finalY = (doc as any).lastAutoTable.finalY || 130;
    doc.setFontSize(14);
    doc.text('III. STATION DIRECTORY', 14, finalY + 15);

    const tableData = stations.map(s => [
        s.callsign,
        s.operator || 'N/A',
        s.status.toUpperCase(),
        s.powerSource?.toUpperCase() || 'UNKNOWN',
        s.frequency ? `${s.frequency}MHz` : 'N/A',
        s.locationName || `${s.lat.toFixed(4)}, ${s.lng.toFixed(4)}`
    ]);

    autoTable(doc, {
        startY: finalY + 22,
        head: [['Callsign', 'Operator', 'Status', 'Power', 'Frequency', 'Location']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
        bodyStyles: { fontSize: 8 },
        didParseCell: (data: any) => {
            if (data.column.index === 2 && data.cell.raw === 'EMERGENCY') {
                data.cell.styles.textColor = [239, 68, 68]; // red-500
                data.cell.styles.fontStyle = 'bold';
            }
        }
    });

    // --- Footer ---
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`9M2PJU SET DASHBOARD SITREP REPORT | PAGE ${i} OF ${pageCount} | END OF RECORD`, 105, 285, { align: 'center' });
    }

    doc.save(filename);
};
