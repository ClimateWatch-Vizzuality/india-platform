# == Schema Information
#
# Table name: data_sources
#
#  id                  :bigint(8)        not null, primary key
#  citation            :text
#  learn_more_link     :string
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

FactoryBot.define do
  factory :data_source do
    sequence(:short_title) { |n| "Source#{n}" }
    title { 'Population' }
    source_organization { 'Central Bureau of Statistics' }
    learn_more_link { 'https://org.org' }
    citation { 'Citation' }
  end
end
