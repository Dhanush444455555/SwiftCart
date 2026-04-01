import React from 'react';
import { User, Package, Settings, LogOut } from 'lucide-react';
import Button from '../components/common/Button';
import './Profile.css';

const Profile = () => {
  return (
    <div className="profile-page animate-fade-in">
      <div className="profile-header glass-card">
        <div className="profile-avatar">
          <User size={48} color="#fff" />
        </div>
        <div className="profile-info">
          <h1>John Doe</h1>
          <p>john.doe@example.com</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-nav glass-card">
          <button className="profile-nav-btn active"><Package size={20} /> Order History</button>
          <button className="profile-nav-btn"><Settings size={20} /> Settings</button>
          <button className="profile-nav-btn logout"><LogOut size={20} /> Logout</button>
        </div>

        <div className="profile-main glass-card">
          <h2>Recent Orders</h2>
          
          <div className="orders-list">
             <div className="order-card box">
               <div className="order-header">
                 <div>
                   <span className="order-id">#SWIFT-891024</span>
                   <span className="order-date">Oct 12, 2023</span>
                 </div>
                 <span className="order-status text-success">Completed</span>
               </div>
               <div className="order-body">
                 <p>2 Items • ₹305.99</p>
                 <Button variant="secondary" className="btn-sm">View Details</Button>
               </div>
             </div>

             <div className="order-card box">
               <div className="order-header">
                 <div>
                   <span className="order-id">#SWIFT-885432</span>
                   <span className="order-date">Sep 28, 2023</span>
                 </div>
                 <span className="order-status text-success">Completed</span>
               </div>
               <div className="order-body">
                 <p>12 Items • ₹145.20</p>
                 <Button variant="secondary" className="btn-sm">View Details</Button>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
