import { Schema, model, models, Types } from 'mongoose';

export interface AdminLogDoc {
  adminId: Types.ObjectId;
  action: string;
  targetId?: Types.ObjectId;
  createdAt: Date;
}

const AdminLogSchema = new Schema<AdminLogDoc>(
  {
    adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    action: { type: String, required: true },
    targetId: { type: Schema.Types.ObjectId },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: { virtuals: true, versionKey: false },
  }
);

export default models.AdminLog || model<AdminLogDoc>('AdminLog', AdminLogSchema);
