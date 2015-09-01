# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150829184828) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "args", force: :cascade do |t|
    t.string  "name"
    t.integer "limit_id"
  end

  create_table "dimensions", force: :cascade do |t|
    t.string  "type"
    t.integer "default"
    t.integer "min"
    t.integer "max"
    t.integer "layout_id"
  end

  create_table "games", force: :cascade do |t|
    t.string "title"
    t.text   "rules"
    t.string "component"
  end

  create_table "layouts", force: :cascade do |t|
    t.string  "type"
    t.integer "spec_id"
  end

  create_table "limits", force: :cascade do |t|
    t.string  "func"
    t.integer "score_id"
  end

  create_table "players", force: :cascade do |t|
    t.integer "default"
    t.integer "min"
    t.integer "max"
    t.integer "levels"
    t.integer "spec_id"
  end

  create_table "saves", force: :cascade do |t|
    t.text     "state"
    t.integer  "user_id"
    t.integer  "game_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "scores", force: :cascade do |t|
    t.integer "default"
    t.integer "spec_id"
  end

  create_table "specs", force: :cascade do |t|
    t.integer "game_id"
  end

  create_table "steps", force: :cascade do |t|
    t.string  "name"
    t.integer "arg_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
