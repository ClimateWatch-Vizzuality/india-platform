# == Schema Information
#
# Table name: data_sources
#
#  id                  :bigint(8)        not null, primary key
#  citation            :text
#  learn_more_link     :string
#  notes               :text
#  short_title         :string
#  source_organization :string
#  title               :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#
# Indexes
#
#  index_data_sources_on_short_title  (short_title) UNIQUE
#

class DataSource < ApplicationRecord
  include ClimateWatchEngine::GenericToCsv

  validates :short_title, presence: true, uniqueness: true
end
