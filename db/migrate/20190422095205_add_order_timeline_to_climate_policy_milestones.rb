class AddOrderTimelineToClimatePolicyMilestones < ActiveRecord::Migration[5.2]
  def change
    add_column :climate_policy_milestones, :order_timeline, :date
  end
end
