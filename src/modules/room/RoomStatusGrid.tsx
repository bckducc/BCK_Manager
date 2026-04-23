import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

export type RoomStatusType = 'available' | 'occupied' | 'maintenance';

export interface Room {
  id: string;
  roomNumber: string;
  status: RoomStatusType;
}

interface RoomStatusGridProps {
  rooms: Room[];
  onRoomClick?: (room: Room) => void;
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const RoomButton = styled.button<{ $status: RoomStatusType }>`
  width: 100%;
  aspect-ratio: 1;
  border: none;
  border-radius: ${theme.radius.sm};
  font-weight: ${theme.fontWeight.bold};
  font-size: ${theme.fontSize.sm};
  cursor: pointer;
  transition: all ${theme.transition.base};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.white};
  box-shadow: ${theme.shadow.sm};

  ${(p) => {
    switch (p.$status) {
      case 'occupied':
        return `
          background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
          &:hover {
            box-shadow: ${theme.shadow.lg};
            transform: translateY(-2px);
          }
        `;
      case 'available':
        return `
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
          &:hover {
            box-shadow: ${theme.shadow.lg};
            transform: translateY(-2px);
          }
        `;
      case 'maintenance':
        return `
          background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
          &:hover {
            box-shadow: ${theme.shadow.lg};
            transform: translateY(-2px);
          }
        `;
      default:
        return '';
    }
  }}
`;

const Legend = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  margin-top: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background: #f5f7fa;
  border-radius: ${theme.radius.sm};
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.fontSize.sm};
`;

const LegendColor = styled.div<{ $color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: ${(p) => p.$color};
`;

export const RoomStatusGrid: React.FC<RoomStatusGridProps> = ({ rooms, onRoomClick }) => {
  const getStatusLabel = (status: RoomStatusType) => {
    switch (status) {
      case 'occupied':
        return 'Đang thuê';
      case 'available':
        return 'Trống';
      case 'maintenance':
        return 'Bảo trì';
    }
  };

  const statusCounts = {
    occupied: rooms.filter((r) => r.status === 'occupied').length,
    available: rooms.filter((r) => r.status === 'available').length,
    maintenance: rooms.filter((r) => r.status === 'maintenance').length,
  };

  return (
    <div>
      <GridContainer>
        {rooms.map((room) => (
          <RoomButton
            key={room.id}
            $status={room.status}
            onClick={() => onRoomClick?.(room)}
            title={`Phòng ${room.roomNumber} - ${getStatusLabel(room.status)}`}
          >
            {room.roomNumber}
          </RoomButton>
        ))}
      </GridContainer>

      <Legend>
        <LegendItem>
          <LegendColor $color="#27ae60" />
          <span>🟢 Đang thuê ({statusCounts.occupied})</span>
        </LegendItem>
        <LegendItem>
          <LegendColor $color="#e74c3c" />
          <span>🔴 Trống ({statusCounts.available})</span>
        </LegendItem>
        <LegendItem>
          <LegendColor $color="#f39c12" />
          <span>🟠 Bảo trì ({statusCounts.maintenance})</span>
        </LegendItem>
      </Legend>
    </div>
  );
};
