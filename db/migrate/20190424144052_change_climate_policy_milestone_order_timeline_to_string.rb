class ChangeClimatePolicyMilestoneOrderTimelineToString < ActiveRecord::Migration[5.2]
  def change
    remove_column :climate_policy_milestones, :order_timeline, :date
    add_column :climate_policy_milestones, :order_timeline, :string
  end
end
