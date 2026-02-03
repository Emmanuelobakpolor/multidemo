import { useState, useEffect } from "react";
import { X, Edit, Save, Trash2, Eye, EyeOff } from "lucide-react";

interface User {
  id: string;
  email: string;
  fullName: string;
  balance: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}



interface Transaction {
  id: string;
  amount: number;
  transaction_type: string;
  status: string;
  date: string;
  reason: string;
  recipient: string;
}

interface UserDetailsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (userId: string, data: Partial<User>) => Promise<void>;
  onDelete: (userId: string) => Promise<void>;
}

const UserDetailsModal = ({ user, isOpen, onClose, onUpdate, onDelete }: UserDetailsModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        fullName: user.fullName,
        balance: user.balance,
        status: user.status,
      });
      fetchUserDetails();
    }
  }, [user]);

  const fetchUserDetails = async () => {
    if (!user) return;

    try {
      // Fetch transactions
      const transactionsResponse = await fetch(`https://multi-bakend.onrender.com/api/payflow/user/${user.email}/transactions`);
      const transactionsData = await transactionsResponse.json();
      if (transactionsData.success) {
        setTransactions(transactionsData.data.slice(0, 10)); // Show last 10 transactions
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await onUpdate(user.id, formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await onDelete(user.id);
      onClose();
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("UserDetailsModal rendered with props:", { isOpen, user });
  if (!isOpen || !user) {
    console.log("UserDetailsModal returning null");
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Edit User" : "User Details"}
          </h3>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">User Information</h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.fullName || ""}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Balance ($)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      value={formData.balance || 0}
                      onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
<p className="text-green-600 font-semibold">
  ${Number(user?.balance ?? 0).toFixed(2)}
</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.status || ""}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="frozen">Frozen</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' :
                      user.status === 'frozen' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Created
                    </label>
                    <p className="text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Updated
                    </label>
                    <p className="text-sm text-gray-600">
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Recent Transactions</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <div key={transaction.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {transaction.recipient || transaction.transaction_type || 'N/A'}
                        </span>
                        <span className={`text-sm font-semibold ${
                          transaction.transaction_type === 'received' ? 'text-green-600' :
                          transaction.transaction_type === 'sent' ? 'text-red-600' :
                          'text-blue-600'
                        }`}>
                          ${transaction.amount.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No transactions found</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {isEditing && (
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  email: user.email,
                  fullName: user.fullName,
                  balance: user.balance,
                  status: user.status,
                });
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Are you sure you want to delete {user.fullName}? This action cannot be undone.
                </p>
              </div>

              <div className="px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Deleting..." : "Delete User"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailsModal;
