FactoryBot.define do
  factory :climate_policy_milestone, class: 'ClimatePolicy::Milestone' do
    association :policy, factory: :climate_policy
    name { 'ECBC integrated in GRIHA ' }
    responsible_authority { 'BEE' }
    date { 'August 2010' }
    data_source_link { 'link' }
    status { 'Attained' }
  end
end
