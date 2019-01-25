FactoryBot.define do
  factory :climate_policy_milestone, class: 'ClimatePolicy::Milestone' do
    association :policy, factory: :climate_policy
    association :source, factory: :climate_policy_source

    name { 'ECBC integrated in GRIHA ' }
    responsible_authority { 'BEE' }
    date { 'August 2010' }
    status { 'Attained' }
  end
end
