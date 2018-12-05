# == Schema Information
#
# Table name: climate_policies
#
#  id                   :bigint(8)        not null, primary key
#  authority            :text
#  sector               :string           not null
#  code                 :string           not null
#  description          :text
#  policy_type          :string           not null
#  title                :text             not null
#  tracking             :boolean
#  tracking_description :text
#

module ClimatePolicy
  class Policy < ApplicationRecord
    self.table_name = 'climate_policies'

    validates_presence_of :sector, :code, :policy_type, :title
    validates :code, uniqueness: true
  end
end
