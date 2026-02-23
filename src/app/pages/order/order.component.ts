import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Delivered' | 'Pending' | 'Cancelled';
  items: number;
}

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {
  orders: Order[] = [];

  ngOnInit(): void {
    // Load sample orders (Replace with actual service call)
    this.loadOrders();
  }

  loadOrders(): void {
    // Sample data - Replace with API call
    this.orders = [
      {
        id: 'ORD-001',
        date: '2024-02-15',
        total: 2450,
        status: 'Delivered',
        items: 3
      },
      {
        id: 'ORD-002',
        date: '2024-02-10',
        total: 1200,
        status: 'Pending',
        items: 2
      },
      {
        id: 'ORD-003',
        date: '2024-02-05',
        total: 3100,
        status: 'Delivered',
        items: 5
      }
    ];
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Delivered':
        return 'status-delivered';
      case 'Pending':
        return 'status-pending';
      case 'Cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }
}
