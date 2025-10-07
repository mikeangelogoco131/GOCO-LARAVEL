<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ExtendFacultiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('faculties', function (Blueprint $table) {
            $table->string('faculty_id')->nullable()->unique()->after('id');
            $table->unsignedInteger('faculty_sequence')->nullable()->after('faculty_id');
            $table->string('middle_name')->nullable()->after('first_name');
            $table->string('suffix')->nullable()->after('last_name');
            // position column already exists as per previous migration/code; if not, uncomment below
            // $table->string('position')->nullable()->after('suffix');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('faculties', function (Blueprint $table) {
            $table->dropColumn(['faculty_id','faculty_sequence','middle_name','suffix']);
        });
    }
}
